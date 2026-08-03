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

def fetch_products(query: str):
    """Tìm kiếm sản phẩm liên quan từ AI Core (RAG) thay vì lấy bừa 30 cái đầu tiên"""
    try:
        req = urllib.request.Request(
            "http://localhost:8001/search",
            data=json.dumps({"query": query, "top_k": 15}).encode('utf-8'),
            headers={'Content-Type': 'application/json'}
        )
        with urllib.request.urlopen(req) as response:
            data = json.loads(response.read().decode('utf-8'))
            results = data.get('results', [])
            
            if not results:
                return "Không tìm thấy sản phẩm nào phù hợp."
                
            inventory = ""
            for item in results:
                inventory += f"- {item}\n"
            return inventory
    except Exception as e:
        print(f"Lỗi gọi Search API: {e}")
        return "Không có thông tin sản phẩm do lỗi kết nối tìm kiếm."

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
                
                # BƯỚC 1: Tìm kiếm sản phẩm thông minh (Vector Search)
                db_context = fetch_products(user_msg)
                
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
=> LƯU Ý VỀ GIỎ HÀNG: Chỉ nhắc đến giỏ hàng nếu nó thực sự liên quan hoặc khách hàng hỏi về nó. TUYỆT ĐỐI KHÔNG nhầm lẫn loại sản phẩm trong giỏ hàng với sản phẩm khách đang tìm kiếm (Ví dụ: Khách đang tìm điện thoại, nhưng giỏ hàng có Laptop, thì không được gọi Laptop là điện thoại). Không tự bịa ra cấu hình của sản phẩm trong giỏ hàng.
"""

                # BƯỚC 2: Định hình Nhân cách và nhồi Kiến thức cho AI (System Prompt)
                system_prompt = f"""Bạn là một chuyên gia tư vấn công nghệ tinh tế, ấm áp và thấu hiểu tâm lý con người.
Nhiệm vụ của bạn không chỉ là bán hàng, mà là lắng nghe và giải quyết vấn đề của khách hàng.
Hãy tuân thủ các nguyên tắc sau:
1. Đồng cảm: Luôn thể hiện sự quan tâm đến nhu cầu hoặc khó khăn của họ (VD: "Mình hiểu {user_context.get('name', 'bạn') if user_context else 'bạn'} đang tìm một chiếc máy mỏng nhẹ...").
2. Chủ động tư vấn: Không hỏi ngược lại khách hàng quá nhiều. Nếu khách hỏi sản phẩm không có sẵn (VD: iPhone 17), hãy TỰ ĐỘNG chọn 1-2 sản phẩm tốt nhất trong TỒN KHO để giới thiệu ngay lập tức kèm theo giá bán và điểm nổi bật, thay vì chỉ hỏi "bạn có muốn xem mẫu khác không".
3. Tư vấn cá nhân hóa: Giải thích rõ "TẠI SAO" sản phẩm gợi ý lại hợp với họ.
4. Giọng điệu: Thân thiện, xưng "mình" và gọi khách bằng tên của họ, dùng emoji một cách chừng mực để tạo sự gần gũi.
5. Ngắn gọn & Không lặp lại: Chỉ liệt kê thông số hoặc tính năng 1 lần duy nhất. Trả lời đúng trọng tâm. Hạn chế kết thúc bằng một câu hỏi.
6. TUYỆT ĐỐI TÔN TRỌNG NGÂN SÁCH: Nếu khách hàng nói ngân sách là X, tuyệt đối KHÔNG GỢI Ý các sản phẩm có giá cao hơn X. Ví dụ: Khách có 22 triệu, không được gợi ý sản phẩm 39 triệu. Không được nói dối về giá tiền.
7. NGÔN NGỮ: Tuyệt đối CHỈ SỬ DỤNG TIẾNG VIỆT 100%. Không bao giờ được phép sử dụng tiếng Trung (Chinese) hay tiếng Anh trong câu trả lời.
8. CHỐNG BỊA ĐẶT (QUAN TRỌNG NHẤT): CHỈ ĐƯỢC PHÉP giới thiệu các sản phẩm CÓ TRONG DANH SÁCH TỒN KHO BÊN DƯỚI. Tuyệt đối KHÔNG ĐƯỢC bịa ra tên sản phẩm, cấu hình, hay mức giá không có trong danh sách. Nếu không có sản phẩm nào phù hợp trong danh sách, hãy thật thà nói "Hiện tại cửa hàng không có sản phẩm nào phù hợp".
{customer_context_str}
Dưới đây là danh sách sản phẩm TỒN KHO THỰC TẾ:
{db_context}
(BẠN SẼ BỊ PHẠT NẶNG NẾU TỰ BỊA RA SẢN PHẨM KHÔNG CÓ TRONG DANH SÁCH NÀY)."""

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
