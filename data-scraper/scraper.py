import time
import csv
import sys
import io
import os
import urllib.request
import re
from playwright.sync_api import sync_playwright

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

CATEGORIES = [
    {"name": "Laptop", "url": "https://www.dienmayxanh.com/laptop"},
    {"name": "Điện thoại", "url": "https://www.dienmayxanh.com/dien-thoai"},
    {"name": "Máy tính bảng", "url": "https://www.dienmayxanh.com/may-tinh-bang"},
    {"name": "Đồng hồ thông minh", "url": "https://www.dienmayxanh.com/dong-ho-thong-minh"},
    {"name": "Tivi", "url": "https://www.dienmayxanh.com/tivi"},
    {"name": "Tủ lạnh", "url": "https://www.dienmayxanh.com/tu-lanh"},
    {"name": "Máy giặt", "url": "https://www.dienmayxanh.com/may-giat"},
    {"name": "Điều hòa", "url": "https://www.dienmayxanh.com/dieu-hoa"},
    {"name": "Máy lọc nước", "url": "https://www.dienmayxanh.com/may-loc-nuoc"},
    {"name": "Nồi cơm điện", "url": "https://www.dienmayxanh.com/noi-com-dien"},
    {"name": "Lò vi sóng", "url": "https://www.dienmayxanh.com/lo-vi-song"},
    {"name": "Nồi chiên không dầu", "url": "https://www.dienmayxanh.com/noi-chien-khong-dau"},
    {"name": "Bếp điện từ", "url": "https://www.dienmayxanh.com/bep-tu"},
    {"name": "Máy hút bụi", "url": "https://www.dienmayxanh.com/may-hut-bui"}
]

# Import image 
IMAGE_SAVE_DIR = os.path.join(os.path.dirname(__file__), "..", "public", "images", "products")

def sanitize_filename(name):
    name = re.sub(r'[^\w\s-]', '', name).strip().lower()
    return re.sub(r'[-\s]+', '-', name)

def download_image(url, filename):
    if not os.path.exists(IMAGE_SAVE_DIR):
        os.makedirs(IMAGE_SAVE_DIR)
        
    filepath = os.path.join(IMAGE_SAVE_DIR, filename)
    
    if os.path.exists(filepath):
        return f"/images/products/{filename}"
        
    if not url.startswith("http"):
        return ""
        
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, timeout=10) as response, open(filepath, 'wb') as out_file:
            data = response.read()
            out_file.write(data)
        return f"/images/products/{filename}"
    except Exception as e:
        print(f"Lỗi tải ảnh {url}: {e}")
        return ""

def scrape_dienmayxanh_all():
    print("🚀 Bắt đầu quá trình cào TOÀN BỘ dữ liệu và tải hình ảnh...")
    all_products = []
    
    if not os.path.exists(IMAGE_SAVE_DIR):
        os.makedirs(IMAGE_SAVE_DIR)
        print(f"📁 Đã tạo thư mục lưu ảnh: {IMAGE_SAVE_DIR}")
    
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=False)
        page = browser.new_page()
        page.set_extra_http_headers({"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"})
        
        for category in CATEGORIES:
            cat_name = category["name"]
            url = category["url"]
            print(f"\n==============================================")
            print(f"📦 Đang cào danh mục: {cat_name}")
            print(f"==============================================")
            
            try:
                page.goto(url, timeout=60000)
                time.sleep(3)
                
                click_count = 0
                while True:
                    page.mouse.wheel(0, 3000)
                    time.sleep(1)
                    try:
                        view_more_btn = page.locator(".view-more").first
                        if view_more_btn.is_visible(timeout=2000):
                            view_more_btn.click()
                            click_count += 1
                            print(f"  👉 Đã bấm nút 'Xem thêm' lần {click_count}...")
                            time.sleep(2)
                        else:
                            break
                    except Exception:
                        break

                print("✅ Đã tải xong danh sách, đang trích xuất và tải hình ảnh (Có thể hơi lâu)...")
                page.mouse.wheel(0, -3000)
                time.sleep(1)
                page.mouse.wheel(0, 1000)
                
                product_elements = page.locator("ul.listproduct li.item")
                count = product_elements.count()
                
                cat_product_count = 0
                for i in range(count):
                    try:
                        el = product_elements.nth(i)
                        name = el.locator(".product-title").inner_text(timeout=500).strip()
                        
                        inventory_status = "Còn hàng"
                        price = 0
                        
                        try:
                            price_text = el.locator(".price").inner_text(timeout=500).strip()
                            price_clean = price_text.replace('₫', '').replace('.', '').replace('*', '').strip()
                            price = int(price_clean) if price_clean.isdigit() else 0
                        except:
                            pass
                        
                        try:
                            labels = el.locator(".item-label, .lb-tragop, .no-price").inner_text(timeout=500).strip().lower()
                            if "ngừng kinh doanh" in labels or "không kinh doanh" in labels:
                                inventory_status = "Ngừng kinh doanh"
                                price = 0
                            elif "sắp về" in labels or "hàng sắp về" in labels:
                                inventory_status = "Hàng sắp về"
                                price = 0
                            elif "bán online" in labels:
                                inventory_status = "Chỉ bán Online"
                        except:
                            pass
                            
                        if price == 0 and inventory_status == "Còn hàng":
                            inventory_status = "Hết hàng"
                            
                        words = name.split(' ')
                        brand = words[1] if ('Laptop' in name or 'Điện thoại' in name) and len(words) > 1 else words[0]
                        
                        # Tải ảnh
                        img_locator = el.locator(".item-img img").first
                        img_url = img_locator.get_attribute("data-src")
                        if not img_url:
                            img_url = img_locator.get_attribute("src")
                            
                        local_image_path = ""
                        if img_url:
                            safe_name = sanitize_filename(f"{brand}_{name}")
                            ext = img_url.split('.')[-1]
                            if len(ext) > 4 or '?' in ext: ext = 'jpg'
                            filename = f"{safe_name}.{ext}"
                            local_image_path = download_image(img_url, filename)
                            
                        all_products.append({
                            "category": cat_name,
                            "brand": brand,
                            "model_name": name,
                            "price_vnd": price,
                            "image_url": local_image_path,
                            "inventory_status": inventory_status
                        })
                        cat_product_count += 1
                        
                    except Exception as e:
                        continue
                
                print(f"✨ Trích xuất và tải ảnh thành công {cat_product_count} sản phẩm cho {cat_name}.")
                
            except Exception as e:
                print(f"❌ Lỗi khi cào danh mục {cat_name}: {e}")

        browser.close()
        
        if all_products:
            csv_file = "database_dmx.csv"
            with open(csv_file, mode='w', newline='', encoding='utf-8') as file:
                writer = csv.DictWriter(file, fieldnames=["category", "brand", "model_name", "price_vnd", "image_url", "inventory_status"])
                writer.writeheader()
                writer.writerows(all_products)
            
            print(f"HOÀN TẤT!")
        else:
            print("❌ Không cào được sản phẩm nào.")

if __name__ == "__main__":
    scrape_dienmayxanh_all()
