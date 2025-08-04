/**
 * SMS Service for sending text messages
 *
 * Required environment variables:
 * - SMS_API_KEY: Your SMS provider API key
 * - SMS_API_SECRET: Your SMS provider API secret
 * - SMS_FROM_NAME: Edusama (default)
 *
 * This service uses a generic SMS provider interface.
 * You can integrate with providers like Twilio, Nexmo, or local Turkish SMS providers.
 */

import { env } from '@api/env';
import { OTP_EXPIRATION_TIME } from '@api/utils/constants';
import z from 'zod';

import { logger } from './logger';

type SmsOptions = {
  to: string;
  message: string;
};

type OtpOptions = {
  phoneNumber: string;
  code: string;
};

const smsTemplates = {
  OTP_VERIFICATION: {
    template: (code: string) =>
      `${env.SMS_FROM_NAME} doğrulama kodunuz: ${code}. Bu kod ${OTP_EXPIRATION_TIME} dakika geçerlidir.`,
  },
  WELCOME: {
    template: (name: string) =>
      `Merhaba ${name}, ${env.SMS_FROM_NAME} sistemine hoş geldiniz!`,
  },
  PASSWORD_RESET: {
    template: (code: string) =>
      `${env.SMS_FROM_NAME} şifre sıfırlama kodunuz: ${code}. Bu kodu kimseyle paylaşmayın.`,
  },
} satisfies Record<
  string,
  {
    template: (...args: any[]) => string;
  }
>;

class SmsService {
  private apiKey: string | undefined;
  private apiSecret: string | undefined;
  private fromName: string;

  constructor() {
    this.apiKey = env.SMS_API_KEY;
    this.apiSecret = env.SMS_API_SECRET;
    this.fromName = env.SMS_FROM_NAME || 'Edusama';
  }

  async verifyConnection() {
    try {
      console.log('🟡 Verifying SMS service connection...');

      if (!this.apiKey || !this.apiSecret) {
        console.log('⚠️ SMS service not configured (API key/secret missing)');
        return false;
      }

      console.log('✅ SMS service configuration verified');
      return true;
    } catch (error) {
      logger.error('❌ Failed to verify SMS service connection', error);
      console.error('❌ Failed to verify SMS service connection');
      return false;
    }
  }

  async sendSms(options: SmsOptions) {
    try {
      console.log('📱 Sending SMS with the following options:');
      console.log('To:', options.to);
      console.log('Message:', options.message);
      console.log('From:', this.fromName);

      if (!this.apiKey || !this.apiSecret) {
        throw new Error(
          'SMS service not configured. Please set SMS_API_KEY and SMS_API_SECRET environment variables.'
        );
      }

      // TODO: Implement actual SMS provider integration
      // This is a placeholder for the actual SMS sending logic
      // You would integrate with your preferred SMS provider here
      // Example providers: Twilio, Nexmo, Turkish SMS providers like iletimerkezi, etc.

      console.log('📱 SMS would be sent in production environment');
      console.log('Message content:', options.message);

      // Simulate successful sending in development
      const messageId = `sms_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      console.log('✅ SMS sent successfully:', messageId);
      logger.info('SMS sent successfully', {
        messageId,
        to: options.to,
        fromName: this.fromName,
      });

      return { messageId, success: true };
    } catch (error) {
      logger.error('Failed while sending SMS', error);
      console.error('❌ Failed to send SMS:', error);
      throw error;
    }
  }

  async sendOtp(options: OtpOptions) {
    const { phoneNumber, code } = options;

    const message = smsTemplates.OTP_VERIFICATION.template(code);

    return await this.sendSms({
      to: phoneNumber,
      message,
    });
  }

  async sendWelcomeSms(phoneNumber: string, name: string) {
    const message = smsTemplates.WELCOME.template(name);

    return await this.sendSms({
      to: phoneNumber,
      message,
    });
  }

  async sendPasswordResetSms(phoneNumber: string, code: string) {
    const message = smsTemplates.PASSWORD_RESET.template(code);

    return await this.sendSms({
      to: phoneNumber,
      message,
    });
  }

  generateOtpCode(length: number = 6): string {
    const digits = '0123456789';
    let result = '';

    for (let i = 0; i < length; i++) {
      result += digits.charAt(Math.floor(Math.random() * digits.length));
    }

    return result;
  }

  validatePhoneNumber(phoneNumber: string): boolean {
    // Accepts formats: +90XXXXXXXXXX, 90XXXXXXXXXX, 0XXXXXXXXXX, XXXXXXXXXX
    const cleanedNumber = phoneNumber.replace(/[\s\-(\\)]/g, '');
    const turkishPhoneSchema = z.string().regex(/^(\+90|90|0)?[5][0-9]{9}$/);

    return turkishPhoneSchema.safeParse(cleanedNumber).success;
  }

  formatPhoneNumber(phoneNumber: string): string {
    // Clean the phone number
    let cleaned = phoneNumber.replace(/[\s\-\\()]/g, '');

    // Add country code if missing
    if (cleaned.startsWith('5') && cleaned.length === 10) {
      cleaned = '+90' + cleaned;
    } else if (cleaned.startsWith('0') && cleaned.length === 11) {
      cleaned = '+90' + cleaned.substring(1);
    } else if (cleaned.startsWith('90') && cleaned.length === 12) {
      cleaned = '+' + cleaned;
    } else if (!cleaned.startsWith('+90')) {
      cleaned = '+90' + cleaned;
    }

    return cleaned;
  }
}

export default new SmsService();
