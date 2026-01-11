import { rateLimit, type Options } from "express-rate-limit";
import type { Request, Response, NextFunction } from "express";
import { logger } from "../../config/logger.js";

/**
 * Middleware de limitación de tasa de solicitudes.
 * Protege contra ataques de fuerza bruta y abuso del servicio.
 */
export const rateLimiter = rateLimit({
  // Ventana de tiempo: 15 minutos
  windowMs: 15 * 60 * 1000,

  // Máximo de solicitudes por ventana por IP
  limit: 100,

  // Usar headers estándar de draft-8
  standardHeaders: "draft-8",

  // No usar headers legacy
  legacyHeaders: false,

  // Mensaje de error personalizado
  message: {
    success: false,
    error: "Demasiadas solicitudes. Por favor, intente de nuevo más tarde.",
  } as any,

  // Handler cuando se excede el límite
  handler: (req: Request, res: Response, _next: NextFunction, options: Options) => {
    logger.warn(`Rate limit excedido para IP: ${req.ip}`);
    res.status(options.statusCode).json(options.message);
  },

  // Usar IP real detrás de proxies (Railway, etc.)
  // Nota: Configurar 'trust proxy' en Express
  keyGenerator: (req: Request) => {
    return req.ip ?? "unknown";
  },
});

/**
 * Limitador más estricto para endpoints sensibles.
 * Ejemplo: Limitar a 10 envíos de email por minuto.
 */
export const strictRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minuto
  limit: 10,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    success: false,
    error: "Límite de envíos excedido. Por favor, espere un momento.",
  } as any,
  handler: (req: Request, res: Response, _next: NextFunction, options: Options) => {
    logger.warn(`Strict rate limit excedido para IP: ${req.ip}`);
    res.status(options.statusCode).json(options.message);
  },
});
