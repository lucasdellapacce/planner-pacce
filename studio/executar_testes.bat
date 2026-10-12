@echo off
echo ====================================================
echo  Executando Testes Automatizados - PACCE Planner Studio
echo ====================================================
cd /d "%~dp0backend"
.\venv\Scripts\python.exe -m pytest -v
pause
