<?php

namespace App\Services\Social;

use App\Models\ChatConversation;
use App\Models\ChatMessage;
use App\Models\ActionLog;
use Illuminate\Support\Facades\DB;

class ChatService
{
    /**
     * Start or Retrieve Conversation between two users
     */
    public function getOrCreateConversation(int $senderId, int $receiverId)
    {
        return ChatConversation::firstOrCreate(
            [
                'sender_id' => min($senderId, $receiverId),
                'receiver_id' => max($senderId, $receiverId),
            ],
            ['last_message_at' => now()]
        );
    }

    /**
     * Send Message with Optional Product Context
     */
    public function sendMessage(array $data)
    {
        return DB::transaction(function () use ($data) {
            $conversation = $this->getOrCreateConversation($data['sender_id'], $data['receiver_id']);
            
            $message = ChatMessage::create([
                'conversation_id' => $conversation->id,
                'sender_id' => $data['sender_id'],
                'message' => $data['message'] ?? null,
                'attachment_url' => $data['attachment_url'] ?? null,
                'product_id' => $data['product_id'] ?? null,
                'is_read' => false
            ]);

            $conversation->update(['last_message_at' => now()]);

            // AI Telemetry: Log Communication
            ActionLog::create([
                'user_id' => $data['sender_id'],
                'type' => 'CHAT_MESSAGE_SENT',
                'payload' => [
                    'conversation_id' => $conversation->id,
                    'has_product' => isset($data['product_id'])
                ],
                'created_at' => now()
            ]);

            return $message;
        });
    }

    /**
     * Mark all messages in conversation as read for a user
     */
    public function markAsRead(int $conversationId, int $userId)
    {
        return ChatMessage::where('conversation_id', $conversationId)
            ->where('sender_id', '!=', $userId)
            ->where('is_read', false)
            ->update(['is_read' => true]);
    }
}
