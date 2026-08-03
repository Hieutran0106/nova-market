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
Khi bạn muốn tính năng Nova Assistant hoạt động, bạn cần khởi động 2 module AI: AI Core (chạy mô hình ngôn ngữ) và AI Advisor (chịu trách nhiệm logic).

### Bước 3.1: Khởi động AI Core (Máy chủ Mô hình)
Mở thêm một tab Terminal **MỚI**, di chuyển vào thư mục `ai-core` và khởi động script:
```bash
cd ai-core
python ai_service.py
```
*(AI Core sẽ chạy ở cổng `http://localhost:8001`. Nó sẽ tự động nạp mô hình ngôn ngữ `Qwen2.5-3B-Instruct (GGUF - Q4_K_M)` và mô hình tìm kiếm ngữ nghĩa `paraphrase-multilingual-MiniLM-L12-v2` vào VRAM của Card đồ họa)*
**Lưu ý:** Lần đầu khởi chạy `ai_service.py` có thể mất thời gian để hệ thống tải mô hình ngôn ngữ và mô hình nhúng tiếng Việt về máy. Khi màn hình hiện `Đã kích hoạt lõi AI` nghĩa là AI Core đã sẵn sàng!

### Bước 3.2: Khởi động AI Advisor (Máy chủ Logic)
Mở thêm một tab Terminal **MỚI**, di chuyển vào thư mục `ai-advisor` và chạy:
```bash
cd ai-advisor
python ai_server.py
```
*(AI Advisor sẽ chạy ở cổng `http://localhost:8000`. Spring Boot Backend ở cổng 8080 sẽ gọi qua cổng này để lấy câu trả lời tư vấn cho Frontend)*

---

## 🗑️ Dọn Dẹp (Tùy chọn)
Trong quá trình phát triển, nếu bạn đã gộp hoàn toàn logic của `ai-advisor` vào Spring Boot Backend, bạn có thể bỏ qua Bước 3.2 và trỏ trực tiếp Java sang `ai-core` ở cổng `8001`. Tuy nhiên hiện tại hệ thống vẫn đang dựa vào Python `ai_server.py` làm trung gian xử lý Prompt.
