import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendForgotPassword(user: User, token: string) {
    const url = `${process.env.FRONT_URL}/reset-password?token=${token}`;
    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Forgot password',
      template: './forgot-password',
      context: {
        username: user.username,
        url,
      },
    });
  }
}
