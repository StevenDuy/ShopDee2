# 🚀 SHOPDEE 2.0 - SMART LOGISTICS AI SANDBOX

Chào mừng bạn đến với dự án **ShopDee 2.0**. Đây là một nền tảng Thương mại điện tử & Logistics 5-trong-1 được thiết kế phục vụ nghiên cứu hành vi AI.

Tài liệu này hướng dẫn chi tiết cách triển khai hệ thống từ đầu trên máy tính cá nhân (Windows/MacOS/Linux) và trỏ ra internet bằng **Cloudflare Tunnel** (Domain riêng).

---

## 📋 GIAI ĐOẠN 1: CÔNG CỤ CẦN THIẾT (Environment Setup)

Trước khi bắt đầu, hãy đảm bảo máy bạn đã cài:

1. **XAMPP**: Cần Apache & MySQL 8.0+.
2. **Node.js**: Phiên bản LTS (v20+).
3. **Composer**: Công cụ quản lý thư viện PHP.
4. **Git**: Để quản lý mã nguồn.

---

## 🔑 GIAI ĐOẠN 2: CỐ TRÚC API & MÔI TRƯỜNG

Hệ thống sử dụng các file `.env` để quản lý cấu hình. Bạn cần tạo chúng từ file mẫu.

### 1. Backend (`/backend/.env`)
- Copy file `.env.example` -> `.env`.
- Cấu hình Database: `DB_DATABASE=shopdee2`, `DB_USERNAME=root`, `DB_PASSWORD=`.
- Cấu hình API Keys (Pusher, Cloudinary, ZaloPay, Google OAuth, Mail SMTP).

### 2. Frontend (`/frontend/.env.local`)
- Copy file `.env.local.example` -> `.env.local`.
- `NEXT_PUBLIC_API_URL`: Điền domain API của bạn (Ví dụ: `https://api.domain.com`).
- `BACKEND_INTERNAL_URL`: Điền `http://localhost:8000` (Dùng để server gọi nội bộ, fix lỗi timeout).
- Điền Key Google OAuth và Key Pusher.

---

## 🌐 GIAI ĐOẠN 3: TỰ HOST WEB CÁ NHÂN (Cloudflare Tunnel)

Để web chạy được trên Internet từ máy cá nhân mà không cần thuê Server/VPS, hãy thực hiện các bước sau:

### Bước 1: Chuẩn bị Domain
- Bạn cần một tên miền đã được đấu nối vào **Cloudflare** (Ví dụ: `domain.com`).

### Bước 2: Cài đặt Cloudflared
Mở Terminal tại thư mục gốc của dự án và tải công cụ CLI của Cloudflare:
- **Windows**: `curl.exe -L -o cloudflared.exe "https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-windows-amd64.exe"`
- **MacOS**: `brew install cloudflare/cloudflare/cloudflared`

### Bước 3: Đăng nhập & Tạo Tunnel
1. `.\cloudflared.exe tunnel login`: Trình duyệt sẽ mở, bạn hãy chọn tên miền của mình và bấm **Authorize**.
2. `.\cloudflared.exe tunnel create shopdee-v2`: Lệnh này sẽ tạo ra một **Tunnel ID** duy nhất. Hãy ghi lại ID này.

### Bước 4: Tạo cấu hình Tunnel
Tạo file `cloudflare-config.yml` ở thư mục gốc dự án:
```yaml
tunnel: YOUR_TUNNEL_ID_HERE
credentials-file: C:\Users\YOUR_USERNAME\.cloudflared\YOUR_TUNNEL_ID_HERE.json

ingress:
  - hostname: YOUR_DOMAIN.COM
    service: http://localhost:3000
  - hostname: api.YOUR_DOMAIN.COM
    service: http://localhost:8000
  - service: http_status:404
```

### Bước 5: Trỏ DNS (Làm 1 lần)
Chạy 2 lệnh này để Cloudflare tự động tạo DNS records (CNAME) trỏ về máy bạn:
```powershell
.\cloudflared.exe tunnel route dns shopdee-v2 YOUR_DOMAIN.COM
.\cloudflared.exe tunnel route dns shopdee-v2 api.YOUR_DOMAIN.COM
```

---

## 🏗️ GIAI ĐOẠN 4: KHỞI TẠO DỮ LIỆU

1. **Khởi tạo Database**: Truy cập `http://localhost/phpmyadmin` và tạo database tên `shopdee2`.
2. **Cài đặt Backend**:
   ```powershell
   cd backend
   composer install
   php artisan key:generate
   php artisan migrate --seed
   ```
3. **Cài đặt Frontend**:
   ```powershell
   cd frontend
   npm install
   ```

---

## ▶️ GIAI ĐOẠN 5: CHẠY HỆ THỐNG

### Cách 1: Dùng script 1-click (Windows)
Đảm bảo đã mở **XAMPP (Apache & MySQL)**, sau đó lùi ra thư mục gốc dự án và chạy:
```powershell
.\start.ps1
```
Script sẽ tự động mở 3 cửa sổ: Laravel, Next.js và Cloudflare Tunnel.

### Cách 2: Chạy thủ công (Linux/MacOS)
Bạn cần mở 3 tab Terminal:
1. **Tab 1 (Backend)**: `cd backend && php artisan serve`
2. **Tab 2 (Frontend)**: `cd frontend && npm run dev`
3. **Tab 3 (Tunnel)**: `.\cloudflared.exe tunnel --config cloudflare-config.yml run`

---

## 🆘 CỬA SỔ KHẮC PHỤC LỖI (Q&A)

- **Lỗi Error 1016 (Origin DNS Error)**: Cloudflare không kết nối được tới máy bạn. Hãy kiểm tra xem Tab Tunnel đã in ra chữ `Connected` chưa. Nếu rồi mà vẫn lỗi, hãy vào Cloudflare DashBoard -> Caching -> Purge Everything.
- **Lỗi API BACKEND ERROR**: Hãy đảm bảo bạn đã điền biến `BACKEND_INTERNAL_URL=http://localhost:8000` trong file `.env.local` của Frontend.
- **Lỗi Cloudflare Worker**: Tuyệt đối không được bật Worker trên domain dùng cho Tunnel, nó sẽ chặn luồng dữ liệu.

---

Chúc bạn có những trải nghiệm nghiên cứu tuyệt vời cùng **ShopDee 2.0**!
