/**
 * Clase personalizada para errores de la aplicación.
 * Permite distinguir errores operacionales de errores de programación.
 */
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(
    message: string,
    statusCode: number = 500,
    isOperational: boolean = true
  ) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;

    // Mantiene el stack trace correcto
    Error.captureStackTrace(this, this.constructor);

    // Establece el nombre del error
    this.name = this.constructor.name;
  }
}

/**
 * Error de validación de datos de entrada.
 */
export class ValidationError extends AppError {
  public readonly details: string[];

  constructor(message: string, details: string[] = []) {
    super(message, 400, true);
    this.details = details;
  }
}

/**
 * Error de autenticación.
 */
export class UnauthorizedError extends AppError {
  constructor(message: string = "No autorizado") {
    super(message, 401, true);
  }
}

/**
 * Error cuando un recurso no es encontrado.
 */
export class NotFoundError extends AppError {
  constructor(message: string = "Recurso no encontrado") {
    super(message, 404, true);
  }
}

/**
 * Error de límite de tasa excedido.
 */
export class RateLimitError extends AppError {
  constructor(message: string = "Demasiadas solicitudes, intente más tarde") {
    super(message, 429, true);
  }
}

/**
 * Error del servicio de email.
 */
export class EmailServiceError extends AppError {
  constructor(message: string = "Error al enviar el correo electrónico") {
    super(message, 502, true);
  }
}
