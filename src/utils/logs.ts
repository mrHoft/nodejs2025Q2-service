import { existsSync, mkdirSync, renameSync, statSync, unlinkSync, createWriteStream  } from 'fs';
import { join } from 'path';

export class LogRotation {
  private readonly maxFileSizeKB: number;
  private readonly maxBackupFiles: number;
  private readonly logDir: string;

  constructor(
    logDir: string,
    maxFileSizeKB: number = 1024,
    maxBackupFiles: number = 5
  ) {
    this.logDir = logDir;
    this.maxFileSizeKB = maxFileSizeKB;
    this.maxBackupFiles = maxBackupFiles;
    this.ensureLogDirectory();
  }

  private ensureLogDirectory() {
    if (!existsSync(this.logDir)) {
      mkdirSync(this.logDir, { recursive: true });
    }
  }

  private getBackupFiles(baseName: string): string[] {
    const files = [];
    for (let i = 1; i <= this.maxBackupFiles; i++) {
      files.push(join(this.logDir, `${baseName}.${i}`));
    }
    return files;
  }

  private rotateFile(logPath: string) {
    const baseName = logPath.split('/').pop()!;
    const backups = this.getBackupFiles(baseName);

    if (existsSync(backups[backups.length - 1])) {
      unlinkSync(backups[backups.length - 1]);
    }

    for (let i = backups.length - 1; i > 0; i--) {
      if (existsSync(backups[i - 1])) {
        renameSync(backups[i - 1], backups[i]);
      }
    }

    if (existsSync(logPath)) {
      renameSync(logPath, backups[0]);
    }
  }

  shouldRotate(logPath: string): boolean {
    if (!existsSync(logPath)) return false;

    const stats = statSync(logPath);
    const fileSizeKB = stats.size / 1024;
    return fileSizeKB >= this.maxFileSizeKB;
  }

  handleRotation(logPath: string) {
    if (this.shouldRotate(logPath)) {
      this.rotateFile(logPath);
    }
  }
}

export class FileLogging {
  private logRotation: LogRotation;
  private requestLogPath: string;
  private errorLogPath: string;

  constructor() {
    const logDir = join(process.cwd(), 'logs');
    this.logRotation = new LogRotation(logDir, 1024, 3);
    this.requestLogPath = join(logDir, 'requests.log');
    this.errorLogPath = join(logDir, 'errors.log');
  }

  private getWriteStream(logPath: string) {
    this.logRotation.handleRotation(logPath);
    return createWriteStream(logPath, { flags: 'a' });
  }

  logRequest(message: string) {
    const stream = this.getWriteStream(this.requestLogPath);
    stream.write(message);
    stream.end();
  }

  logError(message: string) {
    const stream = this.getWriteStream(this.errorLogPath);
    stream.write(message);
    stream.end();
  }
}
