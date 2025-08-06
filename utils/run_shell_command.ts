// D:\Programmation\BookmarkletHub\app\utils\run_shell_command.ts

import { exec } from 'child_process';

interface ShellCommandResult {
  stdout: string;
  stderr: string;
  error: Error | null;
  exitCode: number | null;
}

export function run_shell_command(command: string, description: string): Promise<ShellCommandResult> {
  console.log(`Executing: ${description} - Command: ${command}`);
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing command: ${command}`, error);
        resolve({ stdout, stderr, error, exitCode: error.code });
      } else {
        resolve({ stdout, stderr, error: null, exitCode: 0 });
      }
    });
  });
}
