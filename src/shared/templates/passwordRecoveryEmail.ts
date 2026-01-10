export interface PasswordRecoveryEmailData {
  userName: string;
  resetUrl: string;
}

/**
 * Genera la plantilla HTML para el correo de recuperación de contraseña.
 * Replica la plantilla del EmailService.java original.
 */
export function getPasswordRecoveryEmailTemplate(
  data: PasswordRecoveryEmailData
): string {
  const { userName, resetUrl } = data;

  return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Recuperación de Contraseña</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f4f4;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
    <tr>
      <td style="padding: 40px 30px;">
        <div style="font-family: Arial, sans-serif; color: #333;">
          
          <!-- Header -->
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #007bff; margin: 0; font-size: 24px;">Centro Médico</h1>
          </div>
          
          <!-- Título -->
          <h2 style="color: #333; margin-bottom: 20px;">Recuperación de Contraseña</h2>
          
          <p style="line-height: 1.6; margin-bottom: 20px;">
            Estimado(a) <strong>${userName}</strong>,
          </p>
          
          <p style="line-height: 1.6; margin-bottom: 25px;">
            Hemos recibido una solicitud para restablecer tu contraseña. Para continuar, haz clic en el siguiente botón:
          </p>
          
          <!-- Botón de Reset -->
          <div style="text-align: center; margin-bottom: 25px;">
            <a href="${resetUrl}" 
               style="background-color: #007bff; color: white; padding: 14px 28px; text-align: center; text-decoration: none; display: inline-block; border-radius: 6px; font-weight: bold; font-size: 16px;">
              Restablecer Contraseña
            </a>
          </div>
          
          <!-- Advertencia de expiración -->
          <div style="background-color: #fff3cd; border: 1px solid #ffc107; border-radius: 6px; padding: 15px; margin-bottom: 20px;">
            <p style="margin: 0; color: #856404; font-size: 14px;">
              ⏰ <strong>Importante:</strong> Este enlace expirará en 15 minutos.
            </p>
          </div>
          
          <p style="line-height: 1.6; margin-bottom: 20px; color: #666;">
            Si no solicitaste este cambio, puedes ignorar este correo. Tu contraseña permanecerá sin cambios.
          </p>
          
          <hr style="border: none; border-top: 1px solid #eee; margin: 25px 0;">
          
          <!-- Enlace alternativo -->
          <p style="font-size: 13px; color: #777; line-height: 1.5;">
            Si no puede hacer clic en el botón, copie y pegue el siguiente enlace en su navegador:<br>
            <a href="${resetUrl}" style="color: #007bff; word-break: break-all;">${resetUrl}</a>
          </p>
          
          <!-- Firma -->
          <p style="line-height: 1.6; margin-top: 25px;">
            Atentamente,<br>
            <strong>El equipo del Centro Médico</strong>
          </p>
          
        </div>
      </td>
    </tr>
    
    <!-- Footer -->
    <tr>
      <td style="background-color: #f8f9fa; padding: 20px 30px; border-radius: 0 0 8px 8px;">
        <p style="font-family: Arial, sans-serif; font-size: 12px; color: #999; text-align: center; margin: 0;">
          Este es un correo automático, por favor no responda a este mensaje.
        </p>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}
