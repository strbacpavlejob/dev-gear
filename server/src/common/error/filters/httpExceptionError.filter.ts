import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { InternalError } from '../domain';
import { createGenericResponse } from '../../http/response';

function isInternalError(obj: unknown): obj is InternalError {
  return typeof (<InternalError>obj).errorCode === 'number';
}

function isHttpException(obj: unknown): obj is HttpException {
  return typeof (<HttpException>obj).getResponse?.() === 'object';
}

// Helper interface
interface HttpError {
  statusCode: number;
  message: string;
  error: string;
}

@Catch(Error)
export class HttpExceptionErrorFilter implements ExceptionFilter<Error> {
  catch(error: Error, host: ArgumentsHost): void {
    // Handle internal type error
    if (isInternalError(error)) {
      this.handleInternalError(error, host);
      return;
    }

    // Handle http error
    if (isHttpException(error)) {
      this.handleHttpException(error, host);
      return;
    }

    // Handle any other error
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const responseHttpCode = error['$metadata']?.['httpStatusCode'] || 500;

    response.status(responseHttpCode).json(
      createGenericResponse(
        null,
        [
          {
            message: error.message,
            code: responseHttpCode,
            name: 'SYSTEM_ERROR',
            payload: null,
          },
        ],
        responseHttpCode,
      ),
    );
  }

  handleInternalError(error: InternalError, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    response.status(error.httpCode).json(
      createGenericResponse(
        null,
        [
          {
            message: error.message,
            code: error.errorCode,
            name: error.name,
            payload: error.payload,
          },
        ],
        error.httpCode,
      ),
    );
  }

  handleHttpException(error: HttpException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const { statusCode = 500, message } = error.getResponse() as HttpError;
    response.status(statusCode).json(
      createGenericResponse(
        null,
        [
          {
            message: message,
            code: statusCode,
            name: 'HTTP_EXCEPTION',
            payload: null,
          },
        ],
        statusCode,
      ),
    );
  }
}
