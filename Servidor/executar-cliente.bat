@echo off
echo ========================================
echo   CLIENTE DE TESTE - SOUNDBRIDGE
echo ========================================
echo.

cd /d "%~dp0"
cd bin

java -cp ".;..\lib\postgresql-42.2.23.jar;..\lib\jbcrypt-0.4.jar" test.ClienteTeste

pause
