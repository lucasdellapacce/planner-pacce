@echo off
echo ====================================================
echo  Iniciando Frontend Web - PACCE Planner Studio
echo ====================================================
cd /d "%~dp0frontend"
if not exist "node_modules" (
    echo Instalando dependencias do frontend...
    call npm install
)
echo Abrindo em http://localhost:5173
call npm run dev
pause
