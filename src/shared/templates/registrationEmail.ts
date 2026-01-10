export interface RegistrationEmailData {
  userName: string;
  email: string;
  temporaryPassword: string;
  verificationUrl: string;
}

/**
 * Genera la plantilla HTML para el correo de registro y verificación.
 * Replica la plantilla del EmailService.java original.
 */
export function getRegistrationEmailTemplate(
  data: RegistrationEmailData
): string {
  const { userName, email, temporaryPassword, verificationUrl } = data;

  return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Bienvenido al Centro Médico</title>
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
          
          <!-- Saludo -->
          <h2 style="color: #333; margin-bottom: 20px;">¡Bienvenido(a), ${userName}!</h2>
          
          <p style="line-height: 1.6; margin-bottom: 20px;">
            Ha sido registrado(a) como empleado en nuestro Centro Médico.
          </p>
          
          <!-- Credenciales -->
          <div style="background-color: #f8f9fa; border-radius: 8px; padding: 20px; margin-bottom: 25px;">
            <p style="margin: 0 0 10px 0; font-weight: bold; color: #333;">Sus credenciales temporales son:</p>
            <table role="presentation" cellspacing="0" cellpadding="8" style="width: 100%;">
              <tr>
                <td style="color: #666;"><strong>Email:</strong></td>
                <td style="color: #333;">${email}</td>
              </tr>
              <tr>
                <td style="color: #666;"><strong>Contraseña:</strong></td>
                <td style="color: #333; font-family: monospace; background-color: #fff; padding: 5px 10px; border-radius: 4px;">${temporaryPassword}</td>
              </tr>
            </table>
          </div>
          
          <p style="line-height: 1.6; margin-bottom: 25px;">
            Para activar su cuenta e iniciar sesión, por favor, haga clic en el siguiente botón:
          </p>
          
          <!-- Botón de Verificación -->
          <div style="text-align: center; margin-bottom: 25px;">
            <a href="${verificationUrl}" 
               style="background-color: #007bff; color: white; padding: 14px 28px; text-align: center; text-decoration: none; display: inline-block; border-radius: 6px; font-weight: bold; font-size: 16px;">
              Verificar Cuenta
            </a>
          </div>
          
          <p style="line-height: 1.6; margin-bottom: 20px; color: #666;">
            Una vez verifique su cuenta, se recomienda cambiar su contraseña en la sección de perfil.
          </p>
          
          <hr style="border: none; border-top: 1px solid #eee; margin: 25px 0;">
          
          <!-- Enlace alternativo -->
          <p style="font-size: 13px; color: #777; line-height: 1.5;">
            Si no puede hacer clic en el botón, copie y pegue el siguiente enlace en su navegador:<br>
            <a href="${verificationUrl}" style="color: #007bff; word-break: break-all;">${verificationUrl}</a>
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
