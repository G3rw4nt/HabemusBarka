import { appendFileSync, mkdirSync } from 'fs';
import path from 'path';

const LOG_FILE = path.join(__dirname, '../logs/habemusbarka.log');

mkdirSync(path.dirname(LOG_FILE), { recursive: true });

export function log(msg: string) {
  const now = new Date().toLocaleString('pl-PL', { hour12: false });
  const fullMsg = `[${now}] ${msg}`;
  console.log(fullMsg);
  appendFileSync(LOG_FILE, fullMsg + '\n');
}
