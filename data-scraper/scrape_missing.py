import asyncio
import psycopg2
import urllib.parse
from playwright.async_api import async_playwright
import sys
import io

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

DB_CONFIG = {
    "dbname": "advisor_db",
    "user": "postgres",
    "password": "0329584430",
    "host": "localhost",
    "port": "5432"
}

async def fetch_specs(context, product_id, model_name):
    page = await context.new_page()
    specs_str = ""
    try:
        # Tới trang tìm kiếm
        keyword = urllib.parse.quote(model_name)
        search_url = f"https://www.dienmayxanh.com/search?key={keyword}"
        await page.goto(search_url, timeout=30000)
        
        # Tìm link sản phẩm đầu tiên
        link = page.locator("ul.listsearch li.item a.main-contain").first
        if await link.is_visible(timeout=5000):
            href = await link.get_attribute("href")
            if href:
                detail_url = f"https://www.dienmayxanh.com{href}" if not href.startswith("http") else href
                
                # Tới trang chi tiết
                await page.goto(detail_url, timeout=30000)
                
                # Chờ một lúc cho bảng thông số load
                await page.wait_for_timeout(1000)
                
                # Thử các selector khác nhau cho bảng thông số
                for selector in [".parameter__list", ".parameter-all", ".parameter", ".box-specifi"]:
                    loc = page.locator(selector).first
                    if await loc.is_visible(timeout=2000):
                        specs_str = await loc.inner_text()
                        specs_str = specs_str.replace('\n', ' | ')
                        break
    except Exception as e:
        pass
    finally:
        await page.close()
    
    return product_id, specs_str

async def main():
    conn = psycopg2.connect(**DB_CONFIG)
    cur = conn.cursor()
    
    # Lấy các sản phẩm chưa có thông số
    cur.execute("SELECT id, model_name FROM products WHERE technical_specs IS NULL OR technical_specs = '';")
    rows = cur.fetchall()
    
    print(f"Bắt đầu cào bù thông số cho {len(rows)} sản phẩm...")
    
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        # Giới hạn 5 luồng cùng lúc
        sem = asyncio.Semaphore(5)
        
        async def bounded_fetch(row):
            async with sem:
                context = await browser.new_context(user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36")
                pid, specs = await fetch_specs(context, row[0], row[1])
                await context.close()
                return pid, specs
        
        tasks = [bounded_fetch(row) for row in rows]
        
        count = 0
        success_count = 0
        
        for future in asyncio.as_completed(tasks):
            pid, specs = await future
            count += 1
            if specs:
                cur.execute("UPDATE products SET technical_specs = %s WHERE id = %s", (specs, pid))
                conn.commit()
                success_count += 1
                print(f"[{count}/{len(rows)}] Cập nhật ID {pid} - THÀNH CÔNG")
            else:
                print(f"[{count}/{len(rows)}] Cập nhật ID {pid} - THẤT BẠI (Không tìm thấy trên web)")
        
        await browser.close()
        
    cur.close()
    conn.close()
    print(f"HOÀN TẤT! Đã cào thành công {success_count}/{len(rows)} sản phẩm.")

if __name__ == "__main__":
    asyncio.run(main())
