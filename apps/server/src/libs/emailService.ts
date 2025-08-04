/**
 * Mail Service using Google SMTP
 *
 * Required environment variables:
 * - SMTP_HOST: smtp.gmail.com (default)
 * - SMTP_PORT: 587 (default) or 465 for SSL
 * - SMTP_USER: your-email@gmail.com
 * - SMTP_PASSWORD: your-app-password (not your regular Gmail password)
 * - SMTP_FROM_NAME: Edusama (default)
 * - SMTP_FROM_EMAIL: your-email@gmail.com
 * - FRONTEND_URL: https://your-frontend-url.com
 * - BACKEND_URL: https://your-backend-url.com
 *
 * For Gmail, you need to:
 * 1. Enable 2-factor authentication
 * 2. Generate an App Password (not your regular password)
 * 3. Use the App Password as SMTP_PASSWORD
 */

import { SendInvitationEmailDto } from '@api/api/auth/authModel';
import { StudentUpdateSignupStatusDto } from '@api/api/student/studentModel';
import { env } from '@api/env';
import ejs from 'ejs';
import nodemailer from 'nodemailer';

import { logger } from './logger';

type MailOptions = {
  to: string;
  subject: string;
  content: string;
};

const mailTemplates = {
  RESET_PASSWORD: {
    subject: 'Şifrenizi Sıfırlayın',
    path: './src/views/reset-password.ejs',
  },
  INVITE_USER: {
    subject: 'Edusama Sistemine Giriş Yapın',
    path: './src/views/invitation.ejs',
  },
  INVITE_STUDENT: {
    subject: 'Edusama Sistemine Giriş Yapın',
    path: './src/views/invitation.ejs',
  },
  INVITE_PARENT: {
    subject: 'Edusama Sistemine Giriş Yapın',
    path: './src/views/invitation.ejs',
  },
  SIGNUP_STATUS_UPDATE_REQUESTED_CHANGES: {
    subject: 'Kayıt Durumu Güncellendi',
    path: './src/views/signup-status-update.ejs',
  },
  SIGNUP_STATUS_UPDATE_REJECTED: {
    subject: 'Hesabınız Reddedildi',
    path: './src/views/signup-status-update.ejs',
  },
  SIGNUP_STATUS_UPDATE_ACTIVE: {
    subject: 'Hesabınız Aktif Edildi',
    path: './src/views/signup-status-update.ejs',
  },
} satisfies Record<
  string,
  {
    subject: string;
    path: string;
  }
>;

class EMailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: env.SMTP_HOST,
      port: env.SMTP_PORT,
      secure: env.SMTP_PORT === 465, // true for 465, false for other ports
      auth: {
        user: env.SMTP_USER,
        pass: env.SMTP_PASSWORD,
      },
    });
  }

  async verifyConnection() {
    try {
      console.log('🟡 Verifying SMTP connection...');
      await this.transporter.verify();
      console.log('✅ SMTP connection verified successfully');
      return true;
    } catch (error) {
      logger.error('❌ Failed to verify SMTP connection', error);
      console.error('❌ Failed to verify SMTP connection');
      return false;
    }
  }

  async sendMail(options: MailOptions) {
    try {
      console.log('📤 Sending mail with the following options:');
      console.log('To:', options.to);
      console.log('Subject:', options.subject);
      console.log('From:', `${env.SMTP_FROM_NAME} <${env.SMTP_FROM_EMAIL}>`);

      const mailOptions = {
        from: `${env.SMTP_FROM_NAME} <${env.SMTP_FROM_EMAIL}>`,
        to: options.to,
        subject: options.subject,
        html: options.content,
      };

      const result = await this.transporter.sendMail(mailOptions);
      console.log('✅ Mail sent successfully:', result.messageId);
      logger.info('Email sent successfully', {
        messageId: result.messageId,
        to: options.to,
      });
    } catch (error) {
      logger.error('Failed while sending email', error);
      console.error('❌ Failed to send email:', error);
      throw error;
    }
  }

  async sendResetPasswordMail(to: string, token: string) {
    const mailTemplate = mailTemplates.RESET_PASSWORD;
    const link = `${env.FRONTEND_URL}/reset-password?token=${token}`;
    const logoLink = `${env.BACKEND_URL}/logo.png`;

    const content = await ejs.renderFile(mailTemplate.path, { link, logoLink });

    await this.sendMail({
      to,
      subject: mailTemplate.subject,
      content,
    });
  }

  async sendInvitationMail(dto: SendInvitationEmailDto, token: string) {
    const mailTemplate =
      dto.userType === 'user'
        ? mailTemplates.INVITE_USER
        : dto.userType === 'student'
          ? mailTemplates.INVITE_STUDENT
          : mailTemplates.INVITE_PARENT;
    const link = `${env.FRONTEND_URL}/invitation?token=${token}`;
    const logoLink = `${env.BACKEND_URL}/logo.png`;

    const content = await ejs.renderFile(mailTemplate.path, { link, logoLink });

    await this.sendMail({
      to: dto.email,
      subject: mailTemplate.subject,
      content,
    });
  }

  async sendSignupStatusUpdateEmail(
    to: string,
    dto: StudentUpdateSignupStatusDto,
    token: string
  ) {
    const mailTemplate =
      dto.status === 'REQUESTED_CHANGES'
        ? mailTemplates.SIGNUP_STATUS_UPDATE_REQUESTED_CHANGES
        : dto.status === 'REJECTED'
          ? mailTemplates.SIGNUP_STATUS_UPDATE_REJECTED
          : mailTemplates.SIGNUP_STATUS_UPDATE_ACTIVE;
    const link =
      dto.status === 'REQUESTED_CHANGES'
        ? `${env.FRONTEND_URL}/invitation?token=${token}`
        : `${env.FRONTEND_URL}/login`;
    const logoLink = `${env.BACKEND_URL}/logo.png`;

    const content = await ejs.renderFile(mailTemplate.path, {
      link,
      logoLink,
      status: dto.status,
      message: dto.statusUpdateReason,
    });

    await this.sendMail({
      to,
      subject: mailTemplate.subject,
      content,
    });
  }
}

export default new EMailService();
