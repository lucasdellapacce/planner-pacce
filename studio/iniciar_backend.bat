@echo off
echo ====================================================
echo  Iniciando Backend API - PACCE Planner Studio
echo ====================================================
cd /d "%~dp0backend"
if not exist "venv\Scripts\python.exe" (
    echo Criando ambiente virtual...
    py -m venv venv
    .\venv\Scripts\python.exe -m pip install reportlab Pillow fastapi uvicorn pytest httpx
)
echo Servidor rodando em: http://127.0.0.1:8000
echo Documentacao Swagger: http://127.0.0.1:8000/docs
.\venv\Scripts\python.exe -m uvicorn pacce.api.app:app --app-dir src --host 127.0.0.1 --port 8000 --reload
pause

