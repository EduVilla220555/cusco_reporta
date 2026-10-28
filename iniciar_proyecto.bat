@echo off
title Lanzador Cusco Reporta
echo ======================================================
echo    Iniciando Cusco Reporta (Backend y Frontend)
echo ======================================================
echo.

echo 1. Iniciando Servidor Backend en puerto 5000...
start "Cusco Reporta - Backend (Port 5000)" cmd /k "cd /d %~dp0backend && node server.js"

timeout /t 3 /nobreak >nul

echo 2. Iniciando Servidor Frontend en puerto 5173...
start "Cusco Reporta - Frontend (Port 5173)" cmd /k "cd /d %~dp0frontend && npm run dev"

timeout /t 3 /nobreak >nul

echo 3. Abriendo la aplicacion en tu navegador...
start http://localhost:5173

echo.
echo ======================================================
echo    Servidores iniciados exitosamente.
echo    Puedes cerrar esta ventana auxiliar.
echo ======================================================
timeout /t 5 >nul
