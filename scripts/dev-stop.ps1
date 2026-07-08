$ErrorActionPreference = 'SilentlyContinue'

function Stop-ListenersOnPort {
    param (
        [int]$Port
    )

    $matches = netstat -ano | Select-String "127.0.0.1:$Port\s+.*LISTENING"

    foreach ($match in $matches) {
        $parts = ($match.ToString().Trim() -split '\s+')
        $processId = $parts[-1]

        if ($processId -match '^\d+$') {
            $process = Get-Process -Id ([int] $processId) -ErrorAction SilentlyContinue

            if ($null -ne $process) {
                Write-Host "Stopping $($process.ProcessName) (PID $processId) on port $Port"
                Stop-Process -Id ([int] $processId) -Force -ErrorAction SilentlyContinue
            }
        }
    }
}

$ports = 8000, 5173, 5174, 5175, 5176, 5177, 5178, 5179, 5180

Write-Host 'Stopping dev servers...' -ForegroundColor Yellow

foreach ($port in $ports) {
    Stop-ListenersOnPort -Port $port
}

Write-Host 'Dev servers stopped.' -ForegroundColor Green
