<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Symfony\Component\Process\Process;

class ServeDev extends Command
{
    protected $signature = 'dev';

    protected $description = 'Start the local Laravel, queue, and Vite development stack';

    public function handle(): int
    {
        $this->runDevStop();

        $this->components->info('Starting Laravel dev environment...');
        $this->newLine();

        if (PHP_OS_FAMILY === 'Windows') {
            passthru('npm run dev:stack', $exitCode);

            return (int) $exitCode;
        }

        $process = Process::fromShellCommandline('npm run dev:stack', base_path());
        $process->setTimeout(null);
        $process->setTty(Process::isTtySupported());
        $process->run();

        return $process->getExitCode() ?? self::FAILURE;
    }

    private function runDevStop(): void
    {
        $this->components->info('Cleaning up stale dev servers...');

        if (PHP_OS_FAMILY === 'Windows') {
            passthru('powershell -NoProfile -ExecutionPolicy Bypass -File scripts/dev-stop.ps1');

            return;
        }

        Process::fromShellCommandline('bash scripts/dev-stop.sh', base_path())->mustRun();
    }
}
