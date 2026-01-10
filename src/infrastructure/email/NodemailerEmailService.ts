import nodemailer from "nodemailer";
import type { Transporter } from "nodemailer";
import type { Email } from "../../domain/entities/Email.js";
import type { IEmailService } from "../../domain/interfaces/IEmailService.js";
import { EmailServiceError } from "../../shared/errors/AppError.js";
import { env } from "../config/env.js";
import { logger } from "../config/logger.js";

/**
 * Implementación del servicio de email usando Nodemailer con Gmail SMTP.
 * Capa de Infraestructura - Adaptador de salida.
 */
export class NodemailerEmailService implements IEmailService {
  private transporter: Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true, // Usar TLS
      auth: {
        user: env.GMAIL_USER,
        pass: env.GMAIL_APP_PASSWORD,
      },
      // Configuración adicional de seguridad
      tls: {
        rejectUnauthorized: true,
        minVersion: "TLSv1.2",
      },
    });
  }

  /**
   * Envía un correo electrónico.
   * @param email - Datos del correo a enviar.
   * @returns Promise con el ID del mensaje enviado.
   */
  async sendEmail(email: Email): Promise<string> {
    try {
      const info = await this.transporter.sendMail({
        from: email.from ?? `"Centro Médico Urdiales-Espinoza" <${env.GMAIL_USER}>`,
        to: email.to,
        subject: email.subject,
        html: email.htmlContent,
      });

      logger.debug(`Email enviado con ID: ${info.messageId}`);
      return info.messageId;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Error desconocido";
      logger.error(`Error al enviar email a ${email.to}: ${errorMessage}`);
      throw new EmailServiceError(`Fallo al enviar el correo: ${errorMessage}`);
    }
  }

  /**
   * Verifica la conexión con el servidor SMTP de Gmail.
   * @returns Promise<boolean> indicando si la conexión es exitosa.
   */
  async verifyConnection(): Promise<boolean> {
    try {
      await this.transporter.verify();
      logger.info("✅ Conexión SMTP verificada correctamente");
      return true;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Error desconocido";
      logger.error(`❌ Error verificando conexión SMTP: ${errorMessage}`);
      return false;
    }
  }
}
