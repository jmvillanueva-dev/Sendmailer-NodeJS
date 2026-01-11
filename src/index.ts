import express, { type Application } from "express";
import cors from "cors";
import { createRequire } from "module";
import { pathToFileURL } from "url";

const require = createRequire(import.meta.url);
const helmet = require("helmet");

import { env } from "./infrastructure/config/env.js";
import { logger } from "./infrastructure/config/logger.js";
import { rateLimiter } from "./infrastructure/http/middlewares/rateLimiter.js";
import { errorHandler } from "./infrastructure/http/middlewares/errorHandler.js";
import { createEmailRoutes } from "./infrastructure/http/routes/emailRoutes.js";
import { NodemailerEmailService } from "./infrastructure/email/NodemailerEmailService.js";

/**
 * Crea y configura la aplicación Express.
 */
function createApp(): Application {
  const app = express();

  // Trust proxy para obtener IP real detrás de Railway/Vercel
  app.set("trust proxy", 1);

  // Desactivar header X-Powered-By por seguridad
  app.disable("x-powered-by");

  // ============================================
  // Middlewares globales
  // ============================================

  // Helmet: Headers de seguridad HTTP (usando middlewares individuales)
  app.use(helmet.contentSecurityPolicy());
  app.use(helmet.crossOriginEmbedderPolicy());
  app.use(helmet.crossOriginOpenerPolicy());
  app.use(helmet.crossOriginResourcePolicy());
  app.use(helmet.dnsPrefetchControl());
  app.use(helmet.frameguard());
  app.use(helmet.hidePoweredBy());
  app.use(helmet.hsts());
  app.use(helmet.ieNoOpen());
  app.use(helmet.noSniff());
  app.use(helmet.originAgentCluster());
  app.use(helmet.permittedCrossDomainPolicies());
  app.use(helmet.referrerPolicy());
  app.use(helmet.xssFilter());

  // CORS: Permitir solicitudes cross-origin
  app.use(
    cors({
      origin: env.NODE_ENV === "production" ? env.FRONTEND_URL : "*",
      methods: ["GET", "POST"],
      allowedHeaders: ["Content-Type", "X-API-Key"],
    })
  );

  // Rate limiting global
  app.use(rateLimiter);

  // Parsear JSON
  app.use(express.json({ limit: "10kb" }));

  // ============================================
  // Rutas
  // ============================================

  // Health check endpoint para monitoreo
  app.get("/health", (_req, res) => {
    res.status(200).json({
      status: "ok",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: env.NODE_ENV,
    });
  });

  // Información básica del servicio
  app.get("/", (_req, res) => {
    res.status(200).json({
      service: "Email Microservice",
      version: "1.0.0",
      status: "running",
    });
  });

  // Inicializar servicio de email
  const emailService = new NodemailerEmailService();

  // Rutas de email
  app.use("/api/v1/emails", createEmailRoutes(emailService));

  // ============================================
  // Manejo de errores
  // ============================================

  // Ruta no encontrada
  app.use((_req, res) => {
    res.status(404).json({
      success: false,
      error: "Ruta no encontrada",
    });
  });

  // Error handler global
  app.use(errorHandler);

  return app;
}

/**
 * Inicia el servidor.
 */
async function startServer(): Promise<void> {
  const app = createApp();
  const port = parseInt(env.PORT, 10);

  // Verificar conexión SMTP al iniciar
  const emailService = new NodemailerEmailService();
  const isConnected = await emailService.verifyConnection();

  if (!isConnected) {
    logger.warn(
      "⚠️ No se pudo verificar la conexión SMTP. El servicio iniciará de todas formas."
    );
  }

  app.listen(port, () => {
    logger.info(`Servidor iniciado en puerto ${port}`);
    logger.info(`📧 Entorno: ${env.NODE_ENV}`);
    logger.info(`Health check: http://localhost:${port}/health`);
    logger.info(
      `📨 Endpoint de email: POST http://localhost:${port}/api/v1/emails/send`
    );
  });
}

// Manejar errores no capturados
process.on("uncaughtException", (error) => {
  logger.error("Uncaught Exception:", error);
  process.exit(1);
});

process.on("unhandledRejection", (reason) => {
  logger.error("Unhandled Rejection:", reason);
  process.exit(1);
});

// Iniciar servidor solo si es el módulo principal (local o standalone)
// En Vercel, este archivo se importa, por lo que este bloque no se ejecuta.
if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  startServer().catch((error) => {
    logger.error("Error al iniciar el servidor:", error);
    process.exit(1);
  });
}

// Exportar la aplicación para Vercel Serverless Functions
export default createApp();
