$ErrorActionPreference = 'SilentlyContinue'

$projectRoot = Split-Path -Parent $PSScriptRoot
Set-Location $projectRoot

php artisan dev

exit $LASTEXITCODE
