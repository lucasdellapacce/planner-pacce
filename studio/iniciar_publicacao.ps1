param([string]$BindAddress = '0.0.0.0', [int]$Port = 5173)
$ErrorActionPreference = 'Stop'
$projectRoot = $PSScriptRoot
$pythonPath = Join-Path $projectRoot 'backend\venv\Scripts\python.exe'
if (!(Test-Path -LiteralPath $pythonPath)) {
    throw 'Ambiente Python ausente. Execute iniciar_backend.bat uma vez.'
}
Push-Location (Join-Path $projectRoot 'frontend')
try {
    if (!(Test-Path 'node_modules')) {
        & npm.cmd ci
        if ($LASTEXITCODE -ne 0) { throw 'Falha ao instalar a interface.' }
    }
    & npm.cmd run build
    if ($LASTEXITCODE -ne 0) { throw 'Falha ao compilar a interface.' }
} finally { Pop-Location }
Write-Host "PACCE publicado localmente na porta $Port. Mantenha este processo em execucao."
& $pythonPath -m uvicorn pacce.api.app:app --app-dir (Join-Path $projectRoot 'backend\src') --host $BindAddress --port $Port
exit $LASTEXITCODE
