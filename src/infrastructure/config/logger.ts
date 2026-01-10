import winston from "winston";
import { env } from "./env.js";

const { combine, timestamp, printf, colorize, errors } = winston.format;

/**
 * Formato personalizado para los logs.
 */
const logFormat = printf(({ level, message, timestamp, stack }) => {
  return `${timestamp} [${level}]: ${stack || message}`;
});

/**
 * Configuración de transports según el entorno.
 */
const transports: winston.transport[] = [
  new winston.transports.Console({
    format: combine(
      colorize({ all: true }),
      timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
      errors({ stack: true }),
      logFormat
    ),
  }),
];

// En producción, agregar archivo de logs
if (env.NODE_ENV === "production") {
  transports.push(
    new winston.transports.File({
      filename: "logs/error.log",
      level: "error",
      format: combine(
        timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        errors({ stack: true }),
        winston.format.json()
      ),
    }),
    new winston.transports.File({
      filename: "logs/combined.log",
      format: combine(
        timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        winston.format.json()
      ),
    })
  );
}

/**
 * Logger principal de la aplicación.
 */
export const logger = winston.createLogger({
  level: env.NODE_ENV === "production" ? "info" : "debug",
  transports,
  // No salir en errores no capturados (manejados por el error handler)
  exitOnError: false,
});

/**
 * Stream para integración con morgan (HTTP logging) si se necesita.
 */
export const loggerStream = {
  write: (message: string) => {
    logger.http(message.trim());
  },
};
