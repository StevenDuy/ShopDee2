# 🚀 SHOPDEE 2.0 — HƯỚNG DẪN CÀI ĐẶT & KHỞI ĐỘNG ĐẦY ĐỦ

---

## 📋 GIAI ĐOẠN 1: CÀI ĐẶT CÔNG CỤ CẦN THIẾT

Cài lần đầu, sau đó không cần làm lại.

| Công cụ | Tải tại | Ghi chú |
|---|---|---|
| **XAMPP** | https://www.apachefriends.org | Bật Apache + MySQL |
| **Node.js** | https://nodejs.org | Chọn bản LTS |
| **Composer** | https://getcomposer.org | Quản lý PHP packages |

---

## 🔐 GIAI ĐOẠN 2: CẤU HÌNH CLOUDFLARE TUNNEL (Làm 1 lần duy nhất)

> Đây là bước quan trọng nhất. Làm đúng thì domain `shopdee.io.vn` sẽ hoạt động vĩnh viễn.

### Bước 2.1 — Tải cloudflared.exe

Chạy lệnh này tại thư mục gốc dự án (`ShopDee2/`):

```powershell
curl.exe -L -o cloudflared.exe "https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-windows-amd64.exe"
```

> ⚠️ Phải dùng `curl.exe` (có `.exe`) trong PowerShell, không phải `curl`.

### Bước 2.2 — Đăng nhập Cloudflare

```powershell
.\cloudflared.exe tunnel login
```

Trình duyệt sẽ tự mở → Đăng nhập tài khoản Cloudflare → Chọn domain `shopdee.io.vn` → Bấm **Authorize**.

### Bước 2.3 — Tạo Named Tunnel

```powershell
.\cloudflared.exe tunnel create shopdee-v2
```

Sau lệnh này, terminal sẽ in ra một dòng có chứa **Tunnel ID** dạng:
```
Created tunnel shopdee-v2 with id bdeb1e42-e864-4db2-ac8f-34db3f682022
```
Lưu lại Tunnel ID này. File credentials được tự tạo tại `C:\Users\<TÊN_MÁY>\.cloudflared\<TUNNEL_ID>.json`.

### Bước 2.4 — Tạo file cloudflare-config.yml

Tạo file `cloudflare-config.yml` tại thư mục gốc dự án với nội dung sau (thay `<TUNNEL_ID>` và `<TÊN_MÁY>` theo thực tế):

```yaml
tunnel: <TUNNEL_ID>
credentials-file: C:\Users\<TÊN_MÁY>\.cloudflared\<TUNNEL_ID>.json

ingress:
  - hostname: shopdee.io.vn
    service: http://localhost:3000
  - hostname: api.shopdee.io.vn
    service: http://localhost:8000
  - service: http_status:404
```

**Ví dụ thực tế của máy này:**
```yaml
tunnel: bdeb1e42-e864-4db2-ac8f-34db3f682022
credentials-file: C:\Users\duyh1\.cloudflared\bdeb1e42-e864-4db2-ac8f-34db3f682022.json

ingress:
  - hostname: shopdee.io.vn
    service: http://localhost:3000
  - hostname: api.shopdee.io.vn
    service: http://localhost:8000
  - service: http_status:404
```

### Bước 2.5 — Gắn DNS records vào Cloudflare

```powershell
.\cloudflared.exe tunnel route dns --overwrite-dns shopdee-v2 shopdee.io.vn
.\cloudflared.exe tunnel route dns --overwrite-dns shopdee-v2 api.shopdee.io.vn
```

Mỗi lệnh thành công sẽ in ra:
```
INF Added CNAME shopdee.io.vn -> bdeb1e42-...cfargotunnel.com
```

### Bước 2.6 — Xác nhận DNS trên Cloudflare Dashboard

Vào **https://dash.cloudflare.com** → domain `shopdee.io.vn` → **DNS** → Kiểm tra:

| Type | Name | Target | Proxy |
|---|---|---|---|
| CNAME | `@` | `<TUNNEL_ID>.cfargotunnel.com` | ☁️ Proxied |
| CNAME | `api` | `<TUNNEL_ID>.cfargotunnel.com` | ☁️ Proxied |

> ❌ **Nếu thấy target trỏ về `.trycloudflare.com`**: Xóa record đó và tạo lại thủ công với target đúng.
> ❌ **Nếu có Workers & Pages cũ**: Vào **Workers & Pages** → Xóa hết → Vào **Caching → Purge Everything**.

---

## 🛡️ GIAI ĐOẠN 3: CẤU HÌNH CÁC API BẮT BUỘC (.env)

Sao chép `backend/.env.example` thành `backend/.env` và điền đầy đủ.

> *(Thiếu bất kỳ API nào → Backend từ chối khởi động theo cơ chế bảo vệ tự động.)*

| Biến | Lấy ở đâu |
|---|---|
| `GOOGLE_CLIENT_ID` / `SECRET` | Google Cloud Console → APIs & Services → Credentials → OAuth 2.0 Client ID |
| `MAIL_USERNAME` / `MAIL_PASSWORD` | Tài khoản Google → Bảo mật → App Passwords (16 ký tự) |
| `PUSHER_APP_ID` / `KEY` / `SECRET` | pusher.com → Tạo app → Tab **App Keys** |
| `CLOUDINARY_*` | cloudinary.com → Dashboard → **API Environment variable** |
| `ZALOPAY_*` | ZaloPay Sandbox → Tạo Merchant Test → AppID + Key1 + Key2 |

Với **Frontend**: Sao chép `frontend/.env.local.example` thành `frontend/.env.local` và điền:
- `NEXT_PUBLIC_PUSHER_APP_KEY`
- `NEXT_PUBLIC_GOOGLE_CLIENT_ID`
- `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`

---

## 🏗️ GIAI ĐOẠN 4: KHỞI TẠO DỮ LIỆU (Chỉ làm 1 lần đầu)

### Terminal 1 — Cài Backend

```powershell
cd backend
composer install
php artisan key:generate
php artisan migrate --seed
```

### Terminal 2 — Cài Frontend

```powershell
cd frontend
npm install
```

---

## ▶️ GIAI ĐOẠN 5: KHỞI ĐỘNG HỆ THỐNG (Mỗi lần làm việc)

**Trước tiên:** Mở XAMPP Control Panel → Bấm **Start** cho `Apache` và `MySQL`.

Sau đó chỉ cần chạy **1 lệnh duy nhất** tại thư mục gốc:

```powershell
.\start.ps1
```

Script tự động mở 3 cửa sổ Terminal riêng biệt:
- 🔵 **Backend** — Laravel tại `localhost:8000`
- 🟢 **Frontend** — Next.js tại `localhost:3000` *(chờ in ra `Ready` rồi mới vào web)*
- 🟠 **Tunnel** — Cloudflare kết nối domain cố định

### Địa chỉ truy cập sau khi khởi động:

| Địa chỉ | Mô tả |
|---|---|
| `https://shopdee.io.vn` | Website chính (internet) |
| `https://api.shopdee.io.vn` | API Backend (internet) |
| `http://localhost:3000` | Frontend local |
| `http://localhost:8000` | Backend local |

> **Tài khoản Admin mặc định:** `admin@shopdee.com` / `password`

---

## ⚠️ XỬ LÝ LỖI THƯỜNG GẶP

| Lỗi | Nguyên nhân | Cách fix |
|---|---|---|
| `API BACKEND ERROR` khi vào web | Laravel chưa chạy | Kiểm tra cửa sổ Terminal Backend, chờ nó khởi động xong |
| `Error 524 Timeout` | Next.js chưa sẵn sàng | Chờ cửa sổ Terminal Frontend in ra `✓ Ready` |
| `Error 1016 Origin DNS` | Worker cũ hoặc DNS sai | Xóa Workers & Pages, kiểm tra lại DNS CNAME trên Cloudflare |
| Script bị chặn ExecutionPolicy | Windows bảo mật | Chạy 1 lần: `Set-ExecutionPolicy RemoteSigned -Scope CurrentUser` |
| Tunnel không connect | `cloudflare-config.yml` sai path | Kiểm tra `credentials-file` trỏ đúng file `.json` trong `C:\Users\<TÊN_MÁY>\.cloudflared\` |
