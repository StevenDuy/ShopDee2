# 🚀 SHOPDEE 2: TỪ LOCALHOST ĐẾN WEBSITE ONLINE (SIÊU CHI TIẾT)

Tài liệu này hướng dẫn bạn vận hành ShopDee 2 từ con số 0. Hệ thống đã được tích hợp công cụ kiểm tra tự động: **Nếu thiếu bất kỳ một API quan trọng nào, Backend của hệ thống sẽ tự động văng lỗi và dừng hoạt động để bảo vệ Website.**

---

## 📋 GIAI ĐOẠN 1: CHUẨN BỊ MÔI TRƯỜNG (TOOL CĂN BẢN)

1. **XAMPP**: Tải và mở lên, bấm **Start** cho dòng `Apache` và `MySQL`.
2. **Node.js**: Cài đặt bản LTS.
3. **Composer**: Cài đặt để quản lý thư viện Backend (PHP).
4. **Cloudflared (Để đưa web lên mạng):**
   - Mở Terminal (PowerShell hoặc CMD) ở thư mục gốc của dự án (`ShopDee2`) và chạy lệnh sau để tự động tải và đổi tên:
   ```powershell
   curl.exe -L -o cloudflared.exe "https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-windows-amd64.exe"
   ```
   *(Mẹo: Bắt buộc dùng chữ `curl.exe` nếu bạn đang dùng PowerShell, nếu không nó sẽ bị nhầm với lệnh Invoke-WebRequest)*

---

## 🛡️ GIAI ĐOẠN 2: THIẾT LẬP 6 LOẠI API BẮT BUỘC (.env)

Hệ thống sẽ **BÁO LỖI NGAY LẬP TỨC** nếu một trong 6 dịch vụ dưới đây bị thiếu trong file `.env` của Backend.

Vào `backend/`, copy `.env.example` thành `.env` và điền ĐẦY ĐỦ các nội dung sau:

### 1. Google OAuth (Đăng nhập bằng Google)
- **Truy cập:** Google Cloud Console -> APIs & Services -> Credentials.
- **Tạo OAuth 2.0 Client ID** (Web application).
- **Authorized redirect URIs:** Thêm `https://api.shopdee.io.vn/api/auth/google/callback` hoặc `http://localhost:8000/api/auth/google/callback`.
- **Điền vào .env:** `GOOGLE_CLIENT_ID` và `GOOGLE_CLIENT_SECRET`.

### 2. App Password Mail (Gửi Email SMTP)
- Truy cập vào tài khoản Google -> Mục **Bảo mật (Security)**.
- Bật **Xác minh 2 bước (2-Step Verification)**.
- Vào trang **App Passwords**, tạo mật khẩu ứng dụng MỚI.
- Copy mã 16 ký tự dán vào `MAIL_PASSWORD` trong `.env`. Cập nhật luôn `MAIL_USERNAME` là email của bạn.

### 3. Pusher (Chat Realtime WebSockets)
- **Truy cập:** Pusher.com -> Đăng nhập & Tạo Channel app.
- Lấy thông tin trong tab **App Keys**.
- **Điền vào .env:** `PUSHER_APP_ID`, `PUSHER_APP_KEY`, `PUSHER_APP_SECRET`, cluster (thường là `ap1`).

### 4. Cloudinary (Lưu trữ ảnh tối ưu)
- **Truy cập:** Cloudinary.com.
- Tại Dashboard, copy dòng **API Environment variable**.
- **Điền vào .env:** Điền vào phần `CLOUDINARY_API_KEY`, `CLOUDINARY_CLOUD_NAME`, và `CLOUDINARY_API_SECRET`.

### 5. ZaloPay (Thanh toán trực tuyến)
- **Truy cập:** ZaloPay Sandbox (Cổng thử nghiệm).
- Tạo ứng dụng Merchant Test.
- Lấy `AppID`, `Key1`, `Key2`.
- **Điền vào .env:** `ZALOPAY_APP_ID`, `ZALOPAY_KEY1`, `ZALOPAY_KEY2`.

### 6. Cloudflare Tunnels (Tên miền và Proxy)
- **Điền vào .env:** Biến `CLOUDFLARE_TUNNEL_URL`.
- Đây là URL public từ Cloudflare khi bạn chạy tunnel (Xem chi tiết Giai đoạn 4).

Lưu ý: Đối với **Frontend**, đừng quên copy file `frontend/.env.local.example` thành `.env.local` và điền `NEXT_PUBLIC_PUSHER_APP_KEY` cùng `NEXT_PUBLIC_GOOGLE_CLIENT_ID`.

---

## 🏗️ GIAI ĐOẠN 3: KHỞI TẠO DỮ LIỆU & CHẠY THỦ THỬ (LOCAL)

1. **Web DB:** Vào `http://localhost/phpmyadmin` -> Tạo DB tên: `shopdee`.
2. **Lệnh Backend:** Mở Terminal tại `backend/`:
   - `composer install`
   - `php artisan key:generate`
   - `php artisan migrate --seed`
   - `php artisan serve` (Chạy cổng 8000)
3. **Lệnh Frontend:** Mở Terminal tại `frontend/`:
   - `npm install`
   - `npm run dev` (Chạy ở cổng 3000)

*(Chú ý: Nếu 1 trong 6 API ở trên trống, bước `php artisan serve` sẽ VĂNG LỖI CẤM CHẠY THEO ĐÚNG CƠ CHẾ BẢO VỆ GẮN TRONG AppServiceProvider)*

---

## 🌐 GIAI ĐOẠN 4: TRỎ TÊN MIỀN & CLOUDFLARE (QUAN TRỌNG NHẤT)

Đây là bước để bạn dùng domain thật (Ví dụ: shopdee.io.vn) thay cho localhost.

### Bước 1: Khởi động 2 Đường Hầm "Trục Chính"
- Mở Terminal mới tại thư mục gốc dự án (chứa `cloudflared.exe`):
  - Gõ: `.\cloudflared.exe tunnel --url http://localhost:3000` -> Bạn sẽ nhận được **Link 1** (Cho Frontend).
  - Gõ: `.\cloudflared.exe tunnel --url http://localhost:8000` -> Bạn sẽ nhận được **Link 2** (Cho Backend).
- Copy Link 2 (Cho Backend) và dán vào biến `CLOUDFLARE_TUNNEL_URL` trong file `.env` của Backend để thỏa mãn yêu cầu bắt buộc chạy.

### Bước 2: Vượt Lỗi CORS & Trỏ Tên Miền Thông Qua Worker Proxy
Cloudflare thường chặn ngầm các request của API. Bạn phải dùng Worker:
1. Đăng ký tài khoản Cloudflare, Trỏ NameServers của tên miền mua ở nơi khác (iNet, Tenten) về Cloudflare.
2. Tại Cloudflare Dashboard -> **Workers & Pages** -> **Create Worker** đặt tên `shopdee-proxy`.
3. Bấm **Deploy** -> **Edit Code** và dán đoạn mã này:
```javascript
export default {
 async fetch(request) {
   const url = new URL(request.url);
   // Link 2 là đường dẫn tunnel của backend 8000, Link 1 là frontend 3000
   let target = url.hostname.startsWith("api") ? "LINK_TUNNEL_2" : "LINK_TUNNEL_1";
   const newReq = new Request(target + url.pathname + url.search, request);
   newReq.headers.set("Host", new URL(target).hostname);
   return fetch(newReq);
 }
}
```
4. Lưu lại, sang thẻ **Settings -> Triggers -> Custom Domains**.
5. Gắn 2 đường dẫn: `shopdee.io.vn` và `api.shopdee.io.vn`.

---

🎉 **Chào Mừng Lên Sóng!**
Lúc này bạn đã cấu hình hoàn chỉnh từ Các API thanh toán, xác thực cho đến tên miền tĩnh và bảo mật.  
Tài khoản Admin mặc định để test: `admin@shopdee.com` / Mật khẩu: `password`
