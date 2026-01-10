# Send Email Microservice

Microservicio de envío de correos electrónicos desarrollado con Express, TypeScript y Nodemailer. Diseñado para ser consumido por aplicaciones Spring Boot u otras APIs.

## Características

- **TypeScript con ES Modules**: Código tipado y moderno
- **Arquitectura Limpia**: Separación clara de responsabilidades
- **Gmail SMTP**: Integración con el servicio de correo de Google
- **Seguridad**:
  - Autenticación por API Key
  - Rate limiting
  - Helmet para headers de seguridad
  - CORS configurado
- **Logging**: Winston para logs estructurados
- **Validación**: Zod para validación de entrada

## 📁 Estructura del Proyecto

```
src/
├── domain/                 # Capa de Dominio
│   ├── entities/          # Entidades de negocio
│   └── interfaces/        # Puertos/Interfaces
├── application/           # Capa de Aplicación
│   ├── dtos/             # Data Transfer Objects
│   └── use-cases/        # Casos de uso
├── infrastructure/        # Capa de Infraestructura
│   ├── config/           # Configuración
│   ├── email/            # Implementación Nodemailer
│   └── http/             # Express (rutas, controladores, middlewares)
├── shared/               # Código compartido
│   ├── errors/           # Errores personalizados
│   └── templates/        # Plantillas de email HTML
└── index.ts              # Punto de entrada
```

## Instalación

```bash
# Clonar o navegar al directorio
cd send-email-microservice

# Instalar dependencias
npm install

# Copiar variables de entorno
cp .env.example .env

# Editar .env con tus credenciales
```

## ⚙️ Configuración

### Variables de Entorno

| Variable             | Descripción                           | Ejemplo                      |
| -------------------- | ------------------------------------- | ---------------------------- |
| `PORT`               | Puerto del servidor                   | `3000`                       |
| `NODE_ENV`           | Entorno de ejecución                  | `development` / `production` |
| `GMAIL_USER`         | Correo de Gmail                       | `tu-correo@gmail.com`        |
| `GMAIL_APP_PASSWORD` | App Password de Gmail (16 caracteres) | `xxxx-xxxx-xxxx-xxxx`        |
| `API_KEY`            | Clave para autenticación de clientes  | `tu-clave-segura-32-chars`   |
| `FRONTEND_URL`       | URL del frontend para enlaces         | `https://tuapp.com`          |

### Generar App Password de Gmail

1. Habilita la verificación en 2 pasos en tu cuenta de Google
2. Ve a [App Passwords](https://myaccount.google.com/apppasswords)
3. Genera una nueva contraseña de aplicación
4. Usa el código de 16 caracteres en `GMAIL_APP_PASSWORD`

## Ejecución

```bash
# Desarrollo (con hot reload)
npm run dev

# Producción
npm run build
npm start
```

## 📨 API Endpoints

### Health Check

```http
GET /health
```

**Respuesta:**

```json
{
  "status": "ok",
  "timestamp": "2026-01-10T12:00:00.000Z",
  "uptime": 123.456,
  "environment": "development"
}
```

### Enviar Email

```http
POST /api/v1/emails/send
Content-Type: application/json
X-API-Key: tu-api-key
```

**Body para Registro:**

```json
{
  "to": "usuario@ejemplo.com",
  "type": "registration",
  "userName": "Juan Pérez",
  "token": "token-de-verificacion-aqui",
  "email": "usuario@ejemplo.com",
  "temporaryPassword": "Pass123!"
}
```

**Body para Recuperación de Contraseña:**

```json
{
  "to": "usuario@ejemplo.com",
  "type": "password-recovery",
  "userName": "Juan Pérez",
  "token": "token-de-recuperacion-aqui"
}
```

**Respuesta Exitosa (200):**

```json
{
  "success": true,
  "messageId": "<abc123@mail.gmail.com>",
  "message": "Correo enviado exitosamente"
}
```

**Respuestas de Error:**

- `400` - Datos de entrada inválidos
- `401` - API Key inválida o faltante
- `429` - Rate limit excedido
- `502` - Error del servicio de email

## 🔗 Integración con Spring Boot

### Ejemplo de Cliente HTTP

```java
@Service
@RequiredArgsConstructor
public class EmailServiceClient {

    private final RestTemplate restTemplate;

    @Value("${email.service.url}")
    private String emailServiceUrl;

    @Value("${email.service.api-key}")
    private String apiKey;

    public void enviarCorreoRegistro(Usuario usuario, String password, String token) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("X-API-Key", apiKey);

        Map<String, Object> body = Map.of(
            "to", usuario.getEmail(),
            "type", "registration",
            "userName", usuario.getEmpleado().getNombre() + " " + usuario.getEmpleado().getApellido(),
            "token", token,
            "email", usuario.getEmail(),
            "temporaryPassword", password
        );

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);

        restTemplate.postForEntity(
            emailServiceUrl + "/api/v1/emails/send",
            request,
            Map.class
        );
    }

    public void enviarCorreoRecuperacion(Usuario usuario, String token) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("X-API-Key", apiKey);

        Map<String, Object> body = Map.of(
            "to", usuario.getEmail(),
            "type", "password-recovery",
            "userName", usuario.getEmpleado().getNombre(),
            "token", token
        );

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);

        restTemplate.postForEntity(
            emailServiceUrl + "/api/v1/emails/send",
            request,
            Map.class
        );
    }
}
```

### Configuración en `application.properties`

```properties
# Email Microservice
email.service.url=https://tu-microservicio.railway.app
email.service.api-key=tu-api-key-segura
```

## 🚢 Despliegue en Railway

1. Conecta tu repositorio de GitHub a Railway
2. Railway detectará automáticamente Node.js
3. Configura las variables de entorno en el panel de Railway
4. El build se ejecutará automáticamente

**Comandos usados por Railway:**

- Build: `npm run build`
- Start: `npm start`

## 📝 Licencia

ISC
