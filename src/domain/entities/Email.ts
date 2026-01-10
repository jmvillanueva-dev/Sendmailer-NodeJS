/**
 * Entidad que representa un correo electrónico.
 * Capa de Dominio - Reglas de negocio de la empresa.
 */
export interface Email {
  to: string;
  subject: string;
  htmlContent: string;
  from?: string;
}

export type EmailType = "registration" | "password-recovery";

export interface EmailPayload {
  to: string;
  type: EmailType;
  userName: string;
  token: string;
  // Campos específicos para registro
  email?: string;
  temporaryPassword?: string;
}
