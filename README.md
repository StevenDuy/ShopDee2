# 🚀 ShopDee E-Commerce (Bản Nâng Cấp ShopDee2)

Đây là mã nguồn dự án ShopDee phiên bản 2, được xây dựng với kiến trúc sạch (Clean Architecture), tách biệt tuyệt đối UI và Logic, hỗ trợ 4 vai trò chính: **Admin, Seller, Customer** và **Shipper**.

---

## 🛠️ Yêu Cầu (Requirements)
- **Backend:** Laravel 12 (PHP 8.2+)
- **Frontend:** Next.js (TypeScript, TailwindCSS)
- **Database:** MySQL (XAMPP / TiDB)
- **Lưu trữ:** Cloudinary (Dành cho ảnh)
- **Thời gian thực:** Pusher / Laravel Reverb (Dành cho Chat & Thông báo)

---

## ⚙️ Hướng Dẫn Thiết Lập (Setup Guide)

### 1. Cấu hình Backend (Laravel)
Di chuyển vào thư mục `backend`, sao chép cấu hình mẫu và cài đặt thư viện:
```bash
cd backend
cp .env.example .env
composer install
php artisan key:generate
```
**Hướng dẫn chỉnh sửa `.env`:**
- **DB_DATABASE**: Tạo một Database MySQL tên là `shopdee` trong phpMyAdmin và điền vào đây.
- **CLOUDINARY_URL**: Nhận từ bảng điều khiển Cloudinary để xử lý đăng tải ảnh.
- **PUSHER_APP_KEY**: Dùng cho chức năng Inbox (Chat).
- **GOOGLE_CLIENT_ID**: Cấu hình OAuth từ Google Cloud Console (Dùng cho đăng nhập nhanh).

Sau cùng, chạy lệnh tạo bảng:
```bash
php artisan migrate
```

### 2. Cấu hình Frontend (Next.js)
Di chuyển vào thư mục `frontend`, sao chép cấu hình mẫu và cài đặt thư viện:
```bash
cd frontend
cp .env.local.example .env.local
npm install
```
**Hướng dẫn chỉnh sửa `.env.local`:**
- **NEXT_PUBLIC_API_URL**: Chỉ định địa chỉ API của Laravel (Vd: `https://api.shopdee.io.vn/api`).
- **NEXT_PUBLIC_GOOGLE_CLIENT_ID**: ID dùng để hiện nút đăng nhập Google.

---

## 🏛️ Kiến Trúc Vai Trò (Role Architecture)

Dự án này tuân thủ cấu trúc thư mục nghiêm ngặt dựa trên Vai Trò của người dùng để dễ dàng quản lý chức năng:

### 1. Các Vai Trò Hiện Có:
- **`Admin`**: Quản lý toàn bộ hệ thống, báo cáo doanh thu, duyệt Seller.
- **`Seller`**: Đăng bán sản phẩm, quản lý kho hàng, chat với khách hàng.
- **`Customer`**: Mua sắm hàng hóa, theo dõi đơn hàng, quản lý ví tiền.
- **`Shipper`**: (MỚI) Nhận đơn hàng giao vận, cập nhật trạng thái giao hàng, liên lạc với khách hàng/người bán.

### 2. Quy Tắc Code:
- **Frontend**: Mọi trang trong `src/app/(role)/` phải tách biệt file `page.tsx` (Chứa HTML) và `styles.css` (Chứa CSS).
- **Backend**: Mỗi chức năng (VD: `CreateOrder`, `CancelOrder`) phải là một Action riêng biệt, không được nhồi nhét vào một Controller khổng lồ.
- **Shared**: Các linh kiện UI và Logic dùng chung (Auth, Mail, Image Process) được viết riêng để các Role gọi về dùng chung.

---

## 📦 Các Lệnh Khởi Chạy
- **Chạy Backend:** `php artisan serve` (Mặc định: http://127.0.0.1:8000)
- **Chạy Frontend:** `npm run dev` (Mặc định: http://localhost:3000)
- **Tunnel (Nếu cần callback Google):** `cloudflared tunnel --url http://localhost:8000`

---
*Dự án đang trong quá trình nâng cấp và hoàn thiện các module Shipper.*
