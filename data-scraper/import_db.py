import csv
import psycopg2
import sys
import io

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

def import_csv_to_postgres():
    DB_HOST = "localhost"
    DB_PORT = "5432"
    DB_NAME = "advisor_db"
    DB_USER = "postgres"
    DB_PASS = "0329584430"

    print("🔌 Đang kết nối tới PostgreSQL...")
    try:
        conn = psycopg2.connect(
            host=DB_HOST,
            port=DB_PORT,
            database=DB_NAME,
            user=DB_USER,
            password=DB_PASS
        )
        cur = conn.cursor()
        
        # 1. Tự động thêm cột vào bảng products nếu chưa có
        print("🛠️ Đang kiểm tra và cập nhật cấu trúc bảng 'products'...")
        # Bỏ qua lỗi nếu bảng chưa tồn tại (để Spring Boot tự tạo) hoặc đã có
        try:
            cur.execute("ALTER TABLE products ADD COLUMN IF NOT EXISTS image_url TEXT;")
            cur.execute("ALTER TABLE products ADD COLUMN IF NOT EXISTS inventory_status VARCHAR(50);")
            conn.commit()
        except Exception as e:
            conn.rollback()
            print("Cảnh báo khi alter table:", e)
            
        print("🗑️ Đang xóa toàn bộ dữ liệu cũ trong bảng 'products'...")
        cur.execute("TRUNCATE TABLE products RESTART IDENTITY CASCADE;")
        conn.commit()
            
        print("📥 Đang nạp dữ liệu từ CSV...")
        
        # 2. Đọc file CSV và Insert
        with open('database_dmx.csv', 'r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            count = 0
            for row in reader:
                # Chuyển đổi trạng thái sang in_stock cho tương thích với code cũ
                in_stock = True if row['inventory_status'] == 'Còn hàng' else False
                
                cur.execute("""
                    INSERT INTO products (category, brand, model_name, price_vnd, in_stock, image_url, inventory_status)
                    VALUES (%s, %s, %s, %s, %s, %s, %s)
                """, (
                    row['category'],
                    row['brand'],
                    row['model_name'],
                    int(row['price_vnd']),
                    in_stock,
                    row['image_url'],
                    row['inventory_status']
                ))
                count += 1
                
        conn.commit()
        cur.close()
        conn.close()
        print(f"🎉 THÀNH CÔNG! Đã nạp {count} sản phẩm vào database 'advisor_db'.")
        
    except Exception as e:
        print("❌ LỖI:", e)

if __name__ == '__main__':
    import_csv_to_postgres()
