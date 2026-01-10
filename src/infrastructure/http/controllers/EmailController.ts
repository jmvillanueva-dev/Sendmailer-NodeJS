import type { Request, Response } from "express";
import { SendEmailUseCase } from "../../../application/use-cases/SendEmailUseCase.js";
import type {
  SendEmailRequestDto,
  SendEmailResponseDto,
} from "../../../application/dtos/EmailDtos.js";
import type { IEmailService } from "../../../domain/interfaces/IEmailService.js";

/**
 * Controlador para operaciones de correo electrónico.
 * Maneja las solicitudes HTTP y delega la lógica al caso de uso.
 */
export class EmailController {
  private sendEmailUseCase: SendEmailUseCase;

  constructor(emailService: IEmailService) {
    this.sendEmailUseCase = new SendEmailUseCase(emailService);
  }

  /**
   * Maneja la solicitud de envío de email.
   * POST /api/v1/emails/send
   */
  async sendEmail(req: Request, res: Response): Promise<void> {
    const requestData: SendEmailRequestDto = req.body;

    const messageId = await this.sendEmailUseCase.execute(requestData);

    const response: SendEmailResponseDto = {
      success: true,
      messageId,
      message: "Correo enviado exitosamente",
    };

    res.status(200).json(response);
  }
}
