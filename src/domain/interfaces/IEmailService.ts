import type { Email } from "../entities/Email.js";

/**
 * Interfaz del servicio de correo electrónico.
 * Puerto de salida - Define el contrato para enviar emails.
 */
export interface IEmailService {
  /**
   * Envía un correo electrónico.
   * @param email - Datos del correo a enviar.
   * @returns Promise con el ID del mensaje enviado.
   */
  sendEmail(email: Email): Promise<string>;

  /**
   * Verifica la conexión con el servidor SMTP.
   * @returns Promise<boolean> indicando si la conexión es exitosa.
   */
  verifyConnection(): Promise<boolean>;
}
