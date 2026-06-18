# Startup script for CreditFlow Automated Loan Restructuring System
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "  Starting CreditFlow System Services    " -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan

# 1. Start Python AI Service in a new terminal window
Write-Host "[1/3] Launching Python AI Service (Port 5000)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Write-Host 'Starting Python AI Service...'; cd 'd:\My Project\Credit flow project\creditflow-ai'; pip install -r requirements.txt; python app.py"

# 2. Start Spring Boot Backend in a new terminal window
Write-Host "[2/3] Launching Spring Boot Backend (Port 8080)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Write-Host 'Starting Spring Boot Backend...'; cd 'd:\My Project\Credit flow project\creditflow-backend'; .\mvnw.cmd spring-boot:run"

# 3. Start React Frontend Client in a new terminal window
Write-Host "[3/3] Launching React Frontend Client (Port 5173)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Write-Host 'Starting React Frontend...'; cd 'd:\My Project\Credit flow project\creditflow-app'; npm install; npm run dev"

Write-Host ""
Write-Host "All services launched! Check the individual terminal windows for progress." -ForegroundColor Green
Write-Host "=========================================" -ForegroundColor Cyan
