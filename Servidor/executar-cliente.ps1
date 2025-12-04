# Script PowerShell para executar o cliente de teste
Write-Host "========================================" -ForegroundColor Green
Write-Host "  CLIENTE DE TESTE - SOUNDBRIDGE" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""

$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location "$scriptPath\bin"

java -cp ".;..\lib\postgresql-42.2.23.jar;..\lib\jbcrypt-0.4.jar" test.ClienteTeste

Read-Host -Prompt "Pressione ENTER para sair"
