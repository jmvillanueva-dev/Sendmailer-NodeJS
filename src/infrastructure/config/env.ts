import { z } from "zod";
import "dotenv/config";

/**
 * Esquema de validación para las variables de entorno.
 * Garantiza que todas las variables requeridas estén presentes y sean válidas.
 */
const envSchema = z.object({
  // Servidor
  PORT: z.string().default("3000"),
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),

  // Gmail SMTP
  GMAIL_USER: z
    .string()
    .email("GMAIL_USER debe ser un correo electrónico válido"),
  GMAIL_APP_PASSWORD: z
    .string()
    .min(16, "GMAIL_APP_PASSWORD debe tener al menos 16 caracteres"),

  // Seguridad
  API_KEY: z.string().min(32, "API_KEY debe tener al menos 32 caracteres"),

  // URLs del Frontend
  FRONTEND_URL: z.string().url("FRONTEND_URL debe ser una URL válida"),
});

/**
 * Valida y exporta las variables de entorno tipadas.
 */
function validateEnv() {
  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    console.error("❌ Error en las variables de entorno:");
    result.error.errors.forEach((err) => {
      console.error(`   - ${err.path.join(".")}: ${err.message}`);
    });
    process.exit(1);
  }

  return result.data;
}

export const env = validateEnv();

export type Env = z.infer<typeof envSchema>;
