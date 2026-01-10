import type { Request, Response, NextFunction } from "express";
import { sendEmailRequestSchema } from "../../../application/dtos/EmailDtos.js";
import { ValidationError } from "../../../shared/errors/AppError.js";

/**
 * Middleware de validación para la solicitud de envío de email.
 * Usa Zod para validar y transformar los datos de entrada.
 */
export function validateSendEmailRequest(
  req: Request,
  _res: Response,
  next: NextFunction
): void {
  const result = sendEmailRequestSchema.safeParse(req.body);

  if (!result.success) {
    const details = result.error.errors.map(
      (err) => `${err.path.join(".")}: ${err.message}`
    );
    throw new ValidationError("Datos de entrada inválidos", details);
  }

  // Reemplazar body con datos validados y tipados
  req.body = result.data;

  next();
}
