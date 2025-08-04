import { CustomErrorType } from './types';

export class CustomError extends Error {
  public status: CustomErrorType['status'];
  public message: string;

  constructor(error: CustomErrorType) {
    const { message, status } = error;
    const messageStringified =
      JSON.stringify(message) ||
      '{"en":"An error occurred. Please try again later.","tr":"Bir hata oluştu. Lütfen daha sonra tekrar deneyin."}';

    super(messageStringified);

    this.status = status;
    this.message = messageStringified;
  }
}
