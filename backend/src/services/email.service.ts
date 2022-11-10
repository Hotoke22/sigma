import {injectable, /* inject, */ BindingScope} from '@loopback/core';
import {EmailTemplate, User} from '../models';
import {createTransport, SentMessageInfo} from 'nodemailer';

@injectable({scope: BindingScope.TRANSIENT})
export class EmailService {
  private static async setupTransporter() {
    return createTransport({
      host: process.env.SMTP_SERVER,
      port: +process.env.SMTP_PORT!,
      secure: false, // Para el despliegue actualizar a STARTTLS
      auth: {
        user: process.env.SMTP_USERNAME,
        pass: process.env.SMTP_PASSWORD,
      },
    });
  }
  async sendResetPasswordMail(user: User): Promise<SentMessageInfo> {
    const transporter = await EmailService.setupTransporter();
    const emailTemplate = new EmailTemplate({
      to: user.email,
      subject: '[Sigma] Solicitud de restablecimiento de contraseña',
      html: `
      <div>
          <p>Hello, ${user.name} ${user.surname}</p>
          <p style="color: red;">Recibimos una solicitud para restablecer la contraseña de tu cuenta con la dirección de correo electrónico: ${user.email}</p>
          <p>Para restablecer su contraseña, haga clic en el enlace que se proporciona a continuación</p>
          <a href="${process.env.APPLICATION_URL}/reset-password-finish.html?resetKey=${user.resetKey}">Enlace para reestablecer tu contraseña.</a>
          <p>Si no solicitaste restablecer tu contraseña, ignora este correo electrónico o cambia tu contraseña para proteger tu cuenta.</p>
          <p>Gracias</p>
          <p>Equipo de soporte Sigma</p>
      </div>
      `,
    });
    return transporter.sendMail(emailTemplate);
  }
}
