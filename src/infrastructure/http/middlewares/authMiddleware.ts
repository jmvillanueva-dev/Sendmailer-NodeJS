import type { Request, Response, NextFunction } from "express";
import { UnauthorizedError } from "../../../shared/errors/AppError.js";
import { env } from "../../config/env.js";
import { logger } from "../../config/logger.js";

/**
 * Middleware de autenticación mediante API Key.
 * Valida que la solicitud incluya una clave API válida en el header 'X-API-Key'.
 */
export function apiKeyAuthMiddleware(
  req: Request,
  _res: Response,
  next: NextFunction
): void {
  const apiKey = req.headers["x-api-key"];

  // Verificar que el header exista
  if (!apiKey) {
    logger.warn(`Intento de acceso sin API Key desde IP: ${req.ip}`);
    throw new UnauthorizedError("API Key requerida");
  }

  // Verificar que sea un string (no array)
  const keyValue = Array.isArray(apiKey) ? apiKey[0] : apiKey;

  // Validar la API Key
  if (keyValue !== env.API_KEY) {
    logger.warn(`API Key inválida desde IP: ${req.ip}`);
    throw new UnauthorizedError("API Key inválida");
  }

  next();
}
