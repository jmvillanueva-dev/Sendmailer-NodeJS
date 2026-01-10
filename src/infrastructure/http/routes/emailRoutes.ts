import { Router } from "express";
import { EmailController } from "../controllers/EmailController.js";
import { apiKeyAuthMiddleware } from "../middlewares/authMiddleware.js";
import { strictRateLimiter } from "../middlewares/rateLimiter.js";
import { validateSendEmailRequest } from "../validators/emailValidator.js";
import { asyncHandler } from "../middlewares/errorHandler.js";
import type { IEmailService } from "../../../domain/interfaces/IEmailService.js";

/**
 * Crea y configura las rutas de email.
 * @param emailService - Instancia del servicio de email.
 * @returns Router configurado.
 */
export function createEmailRoutes(emailService: IEmailService): Router {
  const router = Router();
  const emailController = new EmailController(emailService);

  /**
   * POST /api/v1/emails/send
   * Envía un correo electrónico según el tipo especificado.
   *
   * Headers requeridos:
   * - X-API-Key: Clave de autenticación
   *
   * Body:
   * - to: string (email del destinatario)
   * - type: 'registration' | 'password-recovery'
   * - userName: string (nombre del usuario)
   * - token: string (token de verificación o recuperación)
   * - email?: string (email para mostrar en el correo, opcional)
   * - temporaryPassword?: string (contraseña temporal, solo para registro)
   */
  router.post(
    "/send",
    apiKeyAuthMiddleware,
    strictRateLimiter,
    validateSendEmailRequest,
    asyncHandler(async (req, res) => emailController.sendEmail(req, res))
  );

  return router;
}
