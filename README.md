# Nova Market - Hướng Dẫn Khởi Động Dự Án 🚀

Dự án Nova Market bao gồm 3 thành phần chính: **Frontend (React)**, **Backend (Java Spring Boot)**, và **AI Core (Python)**.
Hệ thống AI đã được tích hợp chặt chẽ vào Spring Boot, giúp quá trình khởi động trở nên đơn giản hơn rất nhiều.

## 📦 1. Yêu Cầu Cài Đặt (Prerequisites)
- **Node.js** (Để chạy giao diện Web)
- **Java 17 hoặc 21** & **Maven** (Để chạy Spring Boot Backend)
- **Python 3.10+** (Để chạy lõi AI)
- **PostgreSQL** (Chạy ở cổng `5432`, tài khoản: `postgres`, mật khẩu: `0329584430`, tên database: `advisor_db`)

---

## ⚡ CÀI ĐẶT NHANH (One-Click Install)
Nếu bạn tải dự án từ GitHub về, bạn không cần phải cài đặt thủ công từng phần. 
Chỉ cần nháy đúp chuột vào file **`setup.bat`** (dành cho Windows) ở thư mục gốc. Hệ thống sẽ tự động cài đặt toàn bộ thư viện cho Frontend, Backend và cả AI Core (thông qua `requirements.txt`).

---

## 🏃 2. Cách Chạy Dự Án (Chế độ thông thường)
Nếu bạn chỉ muốn phát triển Web bình thường (không cần chat với AI), bạn chỉ cần chạy 2 thành phần sau:

### Bước 2.1: Bật Backend (Java Spring Boot)
Mở Terminal, di chuyển vào thư mục `backend` và chạy lệnh:
```bash
cd backend
./mvnw spring-boot:run
```
*(Backend sẽ chạy ở cổng `http://localhost:8080`)*

### Bước 2.2: Bật Frontend (React Vite)
Mở một tab Terminal **MỚI**, ở ngay thư mục gốc của dự án, chạy lệnh:
```bash
npm run dev
```
*(Frontend sẽ chạy ở cổng `http://localhost:5173`. Mở link này trên trình duyệt để sử dụng trang web)*

---

## 🧠 3. Cách Bật Trợ Lý AI (Khi cần test chat)
Khi bạn muốn tính năng Nova Assistant (Cửa sổ chat góc dưới bên phải) hoạt động, bạn chỉ cần khởi động bộ não AI Core. Backend Spring Boot sẽ tự động móc nối dữ liệu Database và gửi sang cho AI.

Mở thêm một tab Terminal **MỚI**, di chuyển vào thư mục `ai-core` và khởi động script:
```bash
cd ai-core
python ai_service.py
```
*(AI Core sẽ chạy ở cổng `http://localhost:8001`. Nó sẽ tự động nạp mô hình Qwen 1.5B vào VRAM của Card đồ họa RTX 3050 Ti)*

**Lưu ý:** Lần đầu khởi chạy `ai_service.py` có thể mất từ 10 - 20 giây để hệ thống tải mô hình AI nặng hàng GB vào Card đồ họa. Khi màn hình hiện dòng chữ `INFO: Application startup complete` nghĩa là AI đã sẵn sàng phục vụ!

---

## 🗑️ Dọn Dẹp (Tùy chọn)
Thư mục `ai-advisor` cũ hiện tại đã được gộp logic vào Spring Boot Backend. Bạn có thể xóa thư mục này đi để dự án nhẹ nhàng hơn.
