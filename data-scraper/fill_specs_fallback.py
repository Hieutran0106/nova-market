import psycopg2
import re

try:
    conn = psycopg2.connect(dbname='advisor_db', user='postgres', password='0329584430', host='localhost')
    cur = conn.cursor()

    cur.execute("SELECT id, category, model_name FROM products WHERE technical_specs IS NULL OR technical_specs = '';")
    rows = cur.fetchall()

    def generate_specs(category, name):
        specs = []
        name_up = name.upper()
        if category == 'Laptop':
            cpu = "Intel Core i5" if "I5" in name_up else "Intel Core i7" if "I7" in name_up else "AMD Ryzen 5" if "R5" in name_up else "AMD Ryzen 7" if "R7" in name_up else "Intel Core i3"
            ram = "16GB" if "16GB" in name_up else "32GB" if "32GB" in name_up else "8GB"
            ssd = "512GB" if "512GB" in name_up else "1TB" if "1TB" in name_up else "256GB"
            specs = [f"Vi xử lý (CPU): {cpu}", f"RAM: {ram} DDR4", f"Ổ cứng: {ssd} NVMe SSD", "Màn hình: 15.6 inch Full HD", "Card màn hình: Tích hợp", "Hệ điều hành: Windows 11 Home"]
        elif category == 'Điện thoại':
            ram = "8GB" if "8GB" in name_up else "12GB" if "12GB" in name_up else "4GB"
            rom = "256GB" if "256GB" in name_up else "128GB" if "128GB" in name_up else "512GB" if "512GB" in name_up else "128GB"
            screen = "6.7 inch" if "PRO MAX" in name_up or "ULTRA" in name_up else "6.1 inch"
            specs = [f"Màn hình: {screen} Super AMOLED", f"RAM: {ram}", f"Bộ nhớ trong (ROM): {rom}", "Camera sau: Chính 50MP & Phụ 12MP", "Dung lượng pin: 4500 - 5000 mAh"]
        elif category == 'Tivi':
            size = "55 inch"
            match = re.search(r'(\d+)[\s]*INCH', name_up)
            if match: size = match.group(1) + " inch"
            specs = [f"Kích thước màn hình: {size}", "Độ phân giải: 4K (Ultra HD)", "Hệ điều hành: WebOS / Tizen / Google TV", "Công nghệ hình ảnh: HDR10+, Dolby Vision", "Âm thanh: Dolby Atmos"]
        elif category == 'Tủ lạnh':
            cap = "300 - 400 Lít"
            match = re.search(r'(\d+)[\s]*L', name_up)
            if match: cap = match.group(1) + " Lít"
            specs = [f"Dung tích sử dụng: {cap}", "Công nghệ: Inverter tiết kiệm điện", "Kiểu tủ: Ngăn đá trên / Cửa Pháp", "Tiện ích: Khử mùi, kháng khuẩn"]
        elif category == 'Máy giặt':
            weight = "9 - 10 kg"
            match = re.search(r'(\d+(?:[,.]\d+)?)[\s]*KG', name_up)
            if match: weight = match.group(1) + " kg"
            specs = [f"Khối lượng giặt: {weight}", "Động cơ: Inverter truyền động trực tiếp", "Công nghệ: Giặt hơi nước, diệt khuẩn", "Tốc độ vắt: 1200 - 1400 vòng/phút"]
        elif category == 'Điều hòa':
            power = "1 HP - 9000 BTU"
            if "1.5" in name_up: power = "1.5 HP - 12000 BTU"
            elif "2 " in name_up or "2.0" in name_up: power = "2 HP - 18000 BTU"
            specs = [f"Công suất làm lạnh: {power}", "Công nghệ: Inverter", "Loại gas: R32 thân thiện môi trường", "Tiện ích: Lọc bụi mịn PM2.5"]
        elif category == 'Đồng hồ thông minh':
            specs = ["Màn hình: AMOLED", "Thời lượng pin: 7 - 14 ngày", "Chống nước: 5 ATM", "Tính năng: Đo nhịp tim, SpO2, Theo dõi giấc ngủ", "Chất liệu dây: Silicone cao cấp"]
        else:
            specs = ["Hãng sản xuất: Chính hãng", "Thời gian bảo hành: 12 - 24 tháng", "Tình trạng: Mới 100%", "Tính năng nổi bật: Hoạt động bền bỉ, tiết kiệm điện"]
        
        return " | ".join(specs)

    update_count = 0
    for row in rows:
        spec_str = generate_specs(row[1], row[2])
        cur.execute("UPDATE products SET technical_specs = %s WHERE id = %s", (spec_str, row[0]))
        update_count += 1

    conn.commit()
    print(f"SUCCESS: {update_count}")
except Exception as e:
    print(f"ERROR: {e}")
