import type { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { AppError, ValidationError } from "../../../shared/errors/AppError.js";
import { logger } from "../../config/logger.js";
import { env } from "../../config/env.js";

/**
 * Middleware global de manejo de errores.
 * Captura todos los errores y devuelve respuestas consistentes.
 */
export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  // Log del error
  logger.error(err.stack ?? err.message);

  // Manejar errores de Zod (validación)
  if (err instanceof ZodError) {
    const details = err.errors.map((e) => `${e.path.join(".")}: ${e.message}`);
    res.status(400).json({
      success: false,
      error: "Error de validación",
      details,
    });
    return;
  }

  // Manejar errores de validación personalizados
  if (err instanceof ValidationError) {
    res.status(err.statusCode).json({
      success: false,
      error: err.message,
      details: err.details,
    });
    return;
  }

  // Manejar errores operacionales conocidos
  if (err instanceof AppError && err.isOperational) {
    res.status(err.statusCode).json({
      success: false,
      error: err.message,
    });
    return;
  }

  // Error no operacional (bug, error de programación)
  // En producción, no exponer detalles internos
  const message =
    env.NODE_ENV === "production" ? "Error interno del servidor" : err.message;

  res.status(500).json({
    success: false,
    error: message,
  });
}

/**
 * Wrapper para manejar errores en controladores async.
 * Evita tener que usar try-catch en cada controlador.
 */
export function asyncHandler(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<void>
) {
  return (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}
