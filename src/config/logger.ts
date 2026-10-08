import winston from 'winston'; import { mkdirSync } from 'node:fs'; import { env } from './env.js';

// Garante que a pasta exista antes de abrir os arquivos. if (env.NODE_ENV !== 'test') { mkdirSync('logs', { recursive: true }); }

const levels = { error: 0, warn: 1, info: 2, http: 3, debug: 4, };

winston.addColors({ error: 'red', warn: 'yellow', info: 'green', http: 'magenta', debug: 'white', });

const fileFormat = winston.format.combine( winston.format.timestamp(), winston.format.json(), );

const consoleFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.colorize(),
  winston.format.printf(
    ({ timestamp, level, message }) =>
      `${timestamp ?? ''} ${level}: ${message}`,
  ),
);

export const logger = winston.createLogger({ levels, level: env.NODE_ENV === 'production' ? 'http' : 'debug', silent: env.NODE_ENV === 'test', format: fileFormat,

transports: env.NODE_ENV === 'test' ? [] : [ new winston.transports.Console({ format: consoleFormat, }),

new winston.transports.File({ filename: 'logs/error.log', level: 'error', maxsize: 5 * 1024 * 1024, maxFiles: 3, }),

new winston.transports.File({ filename: 'logs/all.log', maxsize: 5 * 1024 * 1024, maxFiles: 3, }), ], });