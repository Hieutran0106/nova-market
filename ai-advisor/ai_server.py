import http.server
import socketserver
import json
import psycopg2
import urllib.request
import urllib.error
import os
import sys
import io

# Sửa lỗi in ký tự Unicode trên Windows Terminal
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

# Cấu hình Database
DB_CONFIG = {
    "dbname": "advisor_db",
    "user": "postgres",
    "password": "0329584430",
    "host": "localhost",
    "port": "5432"
}

# 1. Kết nối với AI Core Service (Đã tách ra thành microservice)
AI_CORE_URL = "http://localhost:8001/generate"
print(f"✅ Đã cấu hình kết nối tới AI Core tại: {AI_CORE_URL}")

def fetch_products():
    """Lấy danh sách sản phẩm từ PostgreSQL để làm 'Sách giáo khoa' cho AI"""
    try:
        conn = psycopg2.connect(**DB_CONFIG)
        cursor = conn.cursor()
        cursor.execute("SELECT category, brand, model_name, price_vnd, key_features FROM products LIMIT 30")
        rows = cursor.fetchall()
        
        inventory = ""
        for row in rows:
            inventory += f"- {row[0]} {row[1]} {row[2]}: Giá {row[3]:,} VNĐ. Điểm nổi bật: {row[4]}\n"
        
        cursor.close()
        conn.close()
        return inventory
    except Exception as e:
        print(f"Lỗi lấy dữ liệu SQL: {e}")
        return "Không có thông tin sản phẩm do lỗi kết nối Database."

# 2. Xây dựng Server API
class SmartAIHandler(http.server.SimpleHTTPRequestHandler):
    def do_OPTIONS(self):
        self.send_response(200, "ok")
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'X-Requested-With, Content-type')
        self.end_headers()

    def do_POST(self):
        if self.path == '/api/generate':
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            
            try:
                req = json.loads(post_data.decode('utf-8'))
                user_msg = req.get('seed', '')
                user_context = req.get('userContext', None)
                
                # BƯỚC 1: Rút trích dữ liệu từ SQL
                db_context = fetch_products()
                
                # Tạo đoạn Context Khách hàng (nếu có)
                customer_context_str = ""
                if user_context:
                    name = user_context.get('name', 'bạn')
                    cart = user_context.get('cart', [])
                    cart_str = ", ".join(cart) if cart else "chưa có sản phẩm nào"
                    customer_context_str = f"""
[THÔNG TIN KHÁCH HÀNG ĐANG CHAT]
- Tên khách hàng: {name}
- Các sản phẩm đang nằm trong giỏ hàng của {name}: {cart_str}
=> LƯU Ý QUAN TRỌNG: Hãy xưng hô bằng tên của khách hàng ({name}) để tạo sự thân thiện. Chủ động nhắc đến các sản phẩm trong giỏ hàng nếu thấy phù hợp với câu hỏi của họ, hỏi xem họ có cần tư vấn thêm về các món đồ trong giỏ không.
"""

                # BƯỚC 2: Định hình Nhân cách và nhồi Kiến thức cho AI (System Prompt)
                system_prompt = f"""Bạn là một chuyên gia tư vấn công nghệ tinh tế, ấm áp và thấu hiểu tâm lý con người.
Nhiệm vụ của bạn không chỉ là bán hàng, mà là lắng nghe và giải quyết vấn đề của khách hàng.
Hãy tuân thủ các nguyên tắc sau:
1. Đồng cảm: Luôn thể hiện sự quan tâm đến nhu cầu hoặc khó khăn của họ (VD: "Mình hiểu {user_context.get('name', 'bạn') if user_context else 'bạn'} đang tìm một chiếc máy mỏng nhẹ...").
2. Khai thác nhu cầu: Nếu khách yêu cầu chung chung, hãy khéo léo hỏi thêm về ngân sách, sở thích, hoặc mục đích sử dụng.
3. Tư vấn cá nhân hóa: Giải thích rõ "TẠI SAO" sản phẩm này lại hợp với họ, đánh trúng vào tâm lý và mong muốn.
4. Giọng điệu: Thân thiện, xưng "mình" và gọi khách bằng tên của họ, dùng emoji một cách chừng mực để tạo sự gần gũi.
{customer_context_str}
Dưới đây là danh sách sản phẩm TỒN KHO THỰC TẾ:
{db_context}
(Tuyệt đối KHÔNG bịa ra sản phẩm hay mức giá không có trong danh sách trên)."""

                # BƯỚC 3 & 4: Yêu cầu sinh văn bản từ AI Core
                payload = {
                    "system_prompt": system_prompt,
                    "user_message": user_msg,
                    "max_tokens": 500
                }
                
                req_ai = urllib.request.Request(
                    AI_CORE_URL, 
                    data=json.dumps(payload).encode('utf-8'),
                    headers={'Content-Type': 'application/json'}
                )
                
                try:
                    with urllib.request.urlopen(req_ai) as ai_response:
                        ai_data = json.loads(ai_response.read().decode('utf-8'))
                        bot_reply = ai_data.get('text', '')
                except urllib.error.URLError as e:
                    print(f"Lỗi kết nối AI Core: {e}")
                    bot_reply = "Xin lỗi, hiện tại tôi không thể kết nối tới bộ não AI."
                
                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                response = {"text": bot_reply}
                self.wfile.write(json.dumps(response).encode('utf-8'))
                
            except Exception as e:
                self.send_response(500)
                self.send_header('Content-Type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                response = {"error": str(e)}
                self.wfile.write(json.dumps(response).encode('utf-8'))
        else:
            self.send_response(404)
            self.end_headers()

if __name__ == "__main__":
    PORT = 8000
    with socketserver.TCPServer(("", PORT), SmartAIHandler) as httpd:
        print(f"\n🚀 Truy cập vào http://localhost:{PORT}/index.html để mở giao diện Web")
        httpd.serve_forever()
