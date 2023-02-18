import { InternalErrorLogData, InternalHttpError } from './types';

export class InternalError extends Error implements InternalHttpError {
  public name: string;
  public errorCode: number;
  public message: string;
  public payload?: Record<string, string> | undefined;
  public httpCode: number;

  constructor(
    name: string,
    message?: string,
    errorCode?: number,
    payload?: Record<string, string>,
    httpCode?: number,
  ) {
    super(name || 'ANONYMOUS_ERROR');
    this.name = name;
    this.message = message;

    // Set error code
    this.errorCode = errorCode || 1000;

    // Set payload
    this.payload = payload;

    // Set http code
    this.httpCode = httpCode || 500;

    Object.setPrototypeOf(this, InternalError.prototype);
  }

  public getLogData(): InternalErrorLogData {
    return {
      errorClass: this.name,
      errorMessage: this.message,
      metadata: this.getLogDataExtra(),
    };
  }

  protected getLogDataExtra(): Record<string, string> {
    return this.payload;
  }

  getName(): string {
    return this.name;
  }

  getMessage(): string {
    return this.message;
  }

  getHttpStatusCode(): number {
    return this.httpCode;
  }

  getErrorCode(): number {
    return this.errorCode;
  }

  getPayload(): Record<string, string> {
    return this.payload;
  }
}
