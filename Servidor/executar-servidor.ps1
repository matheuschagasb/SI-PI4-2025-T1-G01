# Script PowerShell para executar o servidor
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  SERVIDOR SOUNDBRIDGE - TCP SOCKET" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location "$scriptPath\bin"

java -cp ".;..\lib\postgresql-42.2.23.jar;..\lib\jbcrypt-0.4.jar" servidor.Servidor

Read-Host -Prompt "Pressione ENTER para sair"
