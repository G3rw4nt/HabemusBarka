// src/logger.ts
import winston from 'winston';

export const log = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.printf(info => `[${info.timestamp}] ${info.level.toUpperCase()}: ${info.message}`)
  ),
  transports: [
    new winston.transports.Console({ format: winston.format.colorize({ all: true }) }),
    new winston.transports.File({ filename: 'barka.log' })
  ]
});