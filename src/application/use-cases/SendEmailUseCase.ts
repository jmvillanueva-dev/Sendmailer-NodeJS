import type { IEmailService } from "../../domain/interfaces/IEmailService.js";
import type { SendEmailRequestDto } from "../dtos/EmailDtos.js";
import { getRegistrationEmailTemplate } from "../../shared/templates/registrationEmail.js";
import { getPasswordRecoveryEmailTemplate } from "../../shared/templates/passwordRecoveryEmail.js";
import { logger } from "../../infrastructure/config/logger.js";
import { env } from "../../infrastructure/config/env.js";

/**
 * Caso de uso para enviar correos electrónicos.
 * Orquesta la lógica de negocio para diferentes tipos de email.
 */
export class SendEmailUseCase {
  constructor(private readonly emailService: IEmailService) {}

  /**
   * Ejecuta el caso de uso de envío de email.
   * @param request - Datos de la solicitud validados.
   * @returns Promise con el ID del mensaje enviado.
   */
  async execute(request: SendEmailRequestDto): Promise<string> {
    const { to, type, userName, token, email, temporaryPassword } = request;

    let subject: string;
    let htmlContent: string;

    const frontendUrl = env.FRONTEND_URL;

    switch (type) {
      case "registration": {
        const verificationUrl = `${frontendUrl}/auth/verify?token=${token}`;
        subject = "¡Bienvenido/a al Centro Médico - Verificación de Cuenta";
        htmlContent = getRegistrationEmailTemplate({
          userName,
          email: email ?? to,
          temporaryPassword: temporaryPassword ?? "",
          verificationUrl,
        });
        break;
      }

      case "password-recovery": {
        const resetUrl = `${frontendUrl}/auth/reset-password?token=${token}`;
        subject = "Recuperación de Contraseña - Centro Médico";
        htmlContent = getPasswordRecoveryEmailTemplate({
          userName,
          resetUrl,
        });
        break;
      }

      default:
        throw new Error(`Tipo de email no soportado: ${type}`);
    }

    logger.info(`Enviando email de tipo "${type}" a: ${to}`);

    const messageId = await this.emailService.sendEmail({
      to,
      subject,
      htmlContent,
    });

    logger.info(`Email enviado exitosamente. MessageId: ${messageId}`);

    return messageId;
  }
}
