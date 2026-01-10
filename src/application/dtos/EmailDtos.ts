import { z } from "zod";

/**
 * Esquema de validación para la solicitud de envío de email.
 */
export const sendEmailRequestSchema = z.object({
  to: z.string().email('El campo "to" debe ser un correo electrónico válido'),
  type: z.enum(["registration", "password-recovery"], {
    errorMap: () => ({
      message: 'El campo "type" debe ser "registration" o "password-recovery"',
    }),
  }),
  userName: z
    .string()
    .min(1, 'El campo "userName" es requerido')
    .max(100, 'El campo "userName" no puede exceder 100 caracteres'),
  token: z
    .string()
    .min(10, 'El campo "token" debe tener al menos 10 caracteres')
    .max(512, 'El campo "token" no puede exceder 512 caracteres'),
  // Campos opcionales específicos para registro
  email: z
    .string()
    .email('El campo "email" debe ser un correo electrónico válido')
    .optional(),
  temporaryPassword: z
    .string()
    .min(6, 'El campo "temporaryPassword" debe tener al menos 6 caracteres')
    .optional(),
});

export type SendEmailRequestDto = z.infer<typeof sendEmailRequestSchema>;

/**
 * DTO de respuesta para envío de email exitoso.
 */
export interface SendEmailResponseDto {
  success: boolean;
  messageId: string;
  message: string;
}

/**
 * DTO de respuesta para errores.
 */
export interface ErrorResponseDto {
  success: boolean;
  error: string;
  details?: string[];
}
