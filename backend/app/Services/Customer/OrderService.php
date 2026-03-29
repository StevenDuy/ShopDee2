<?php

namespace App\Services\Customer;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\ProductOptionValue;
use App\Models\Wallet;
use App\Models\SellerFinance;
use App\Models\ActionLog;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class OrderService
{
    /**
     * Handle Checkout Logic
     */
    public function checkout(array $data)
    {
        return DB::transaction(function () use ($data) {
            $user = auth()->user();
            $totalAmount = 0;
            $orderItems = [];

            // 1. Process items and calculate total
            foreach ($data['items'] as $item) {
                $product = Product::lockForUpdate()->findOrFail($item['product_id']);
                
                if ($product->status !== 'active') {
                    throw new \Exception("Product '{$product->title}' is not available.");
                }

                $unitPrice = $product->current_price;
                $variantIds = $item['variant_ids'] ?? [];

                // Logic: Direct stock vs Variant stock
                if (empty($variantIds)) {
                    if ($product->stock_quantity < $item['quantity']) {
                        throw new \Exception("Insufficient stock for '{$product->title}'.");
                    }
                    $product->decrement('stock_quantity', $item['quantity']);
                } else {
                    $variants = ProductOptionValue::whereIn('id', $variantIds)->get();
                    foreach ($variants as $variant) {
                        if ($variant->stock_quantity < $item['quantity']) {
                            throw new \Exception("Insufficient stock for '{$variant->value}'.");
                        }
                        $variant->decrement('stock_quantity', $item['quantity']);
                    }
                }

                $subtotal = $unitPrice * $item['quantity'];
                $totalAmount += $subtotal;

                $orderItems[] = [
                    'product_id' => $product->id,
                    'product_title' => $product->title,
                    'price' => $unitPrice,
                    'quantity' => $item['quantity'],
                    'selected_options' => $item['selected_options'] ?? null,
                    'variant_ids' => $variantIds,
                ];
            }

            // 2. Create Order
            $order = Order::create([
                'customer_id' => $user->id,
                'order_number' => 'ORD-' . strtoupper(Str::random(10)),
                'total_amount' => $totalAmount,
                'shipping_fee' => $data['shipping_fee'] ?? 0,
                'status' => 'pending',
                'payment_method' => $data['payment_method'],
                'address_id' => $data['address_id'],
            ]);

            foreach ($orderItems as $item) {
                $item['order_id'] = $order->id;
                OrderItem::create($item);
            }

            // 3. Financial Logic (Wallet & Escrow)
            if ($data['payment_method'] === 'wallet') {
                $wallet = Wallet::where('user_id', $user->id)->first();
                if (!$wallet || $wallet->balance < $totalAmount) {
                    throw new \Exception("Insufficient wallet balance.");
                }
                
                // Move funds to Escrow (Sandbox behavior)
                $wallet->decrement('balance', $totalAmount);
                $wallet->increment('escrow_balance', $totalAmount);
                
                $order->update(['payment_status' => 'paid', 'paid_at' => now()]);
            }

            // 4. Create Seller Finance Record
            SellerFinance::create([
                'seller_id' => $product->seller_id, // Simplified for single seller per order context
                'type' => 'income',
                'amount' => $totalAmount,
                'status' => 'pending', // Released only when completed
                'description' => "Income for Order #{$order->order_number}",
                'reference_order_id' => $order->id
            ]);

            // 5. AI Telemetry
            ActionLog::create([
                'user_id' => $user->id,
                'type' => 'ORDER_CHECKOUT',
                'payload' => [
                    'order_id' => $order->id,
                    'total_amount' => $totalAmount,
                    'payment_method' => $data['payment_method']
                ],
                'created_at' => now()
            ]);

            return $order->load('items');
        });
    }

    /**
     * Cancel Order and Restore Stock
     */
    public function cancelOrder(Order $order)
    {
        return DB::transaction(function () use ($order) {
            if (!in_array($order->status, ['pending', 'paid'])) {
                throw new \Exception("Cannot cancel order in status: {$order->status}");
            }

            // 1. Restore Stock
            foreach ($order->items as $item) {
                if (empty($item->variant_ids)) {
                    Product::where('id', $item->product_id)->increment('stock_quantity', $item->quantity);
                } else {
                    ProductOptionValue::whereIn('id', $item->variant_ids)->increment('stock_quantity', $item->quantity);
                }
            }

            // 2. Handle Refund (if paid via wallet)
            if ($order->payment_status === 'paid' && $order->payment_method === 'wallet') {
                $wallet = Wallet::where('user_id', $order->customer_id)->first();
                $wallet->decrement('escrow_balance', $order->total_amount);
                $wallet->increment('balance', $order->total_amount);
            }

            // 3. Update Status
            $order->update(['status' => 'cancelled']);

            // 4. Update Finance
            SellerFinance::where('reference_order_id', $order->id)->update(['status' => 'failed']);

            return $order;
        });
    }
}
