# Script para Iniciar Emulador Android
Write-Host "🚀 Iniciando Emulador Android..." -ForegroundColor Cyan
Write-Host ""

# Verificar se emulator está no PATH
try {
    $emulatorPath = Get-Command emulator -ErrorAction Stop
    Write-Host "✓ Emulator encontrado: $($emulatorPath.Source)" -ForegroundColor Green
} catch {
    Write-Host "✗ Emulator não encontrado no PATH" -ForegroundColor Red
    Write-Host ""
    Write-Host "Configure as variáveis de ambiente primeiro!" -ForegroundColor Yellow
    Write-Host "Consulte: GUIA_INSTALACAO_ANDROID.md" -ForegroundColor Yellow
    Read-Host "Pressione Enter para sair"
    exit
}

# Listar emuladores disponíveis
Write-Host ""
Write-Host "📱 Emuladores disponíveis:" -ForegroundColor Cyan
$avds = emulator -list-avds 2>&1

if (-not $avds) {
    Write-Host ""
    Write-Host "✗ Nenhum emulador encontrado!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Crie um emulador no Android Studio:" -ForegroundColor Yellow
    Write-Host "1. Abra Android Studio" -ForegroundColor White
    Write-Host "2. Tools > Device Manager" -ForegroundColor White
    Write-Host "3. Clique em 'Create Device'" -ForegroundColor White
    Write-Host "4. Escolha Pixel 5 e API 33" -ForegroundColor White
    Read-Host "Pressione Enter para sair"
    exit
}

# Mostrar lista numerada
$avdList = @($avds)
for ($i = 0; $i -lt $avdList.Count; $i++) {
    Write-Host "  [$($i + 1)] $($avdList[$i])" -ForegroundColor Green
}

Write-Host ""
Write-Host "Escolha um emulador (ou Enter para usar o primeiro):" -ForegroundColor Yellow
$choice = Read-Host "Digite o número"

if (-not $choice) {
    $choice = "1"
}

$index = [int]$choice - 1
if ($index -lt 0 -or $index -ge $avdList.Count) {
    Write-Host "Opção inválida!" -ForegroundColor Red
    Read-Host "Pressione Enter para sair"
    exit
}

$selectedAvd = $avdList[$index]
Write-Host ""
Write-Host "🚀 Iniciando emulador: $selectedAvd" -ForegroundColor Cyan
Write-Host ""
Write-Host "⏳ Aguarde... (pode levar 1-2 minutos)" -ForegroundColor Yellow
Write-Host ""
Write-Host "💡 Dicas:" -ForegroundColor Cyan
Write-Host "  • Este terminal ficará aberto enquanto o emulador estiver rodando" -ForegroundColor White
Write-Host "  • Abra outro terminal para executar: npm start" -ForegroundColor White
Write-Host "  • Pressione Ctrl+C aqui para fechar o emulador" -ForegroundColor White
Write-Host ""

# Iniciar emulador
emulator -avd $selectedAvd
