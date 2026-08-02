@echo off
chcp 65001 >nul
echo    NOVA MARKET - CÀI ĐẶT TỰ ĐỘNG
echo.

echo [1/3] Đang cài đặt thư viện Frontend (React Vite)...
call npm install
echo ✅ Xong Frontend!
echo.

echo [2/3] Đang cài đặt thư viện AI Core (Python)...
cd ai-core
call pip install -r requirements.txt
cd ..
echo ✅ Xong AI Core!
echo.

echo [3/3] Đang tải thư viện Backend (Java Spring Boot)...
cd backend
call mvnw dependency:resolve
cd ..
echo ✅ Xong Backend!
echo.

pause
