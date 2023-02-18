import { ErrorThrowDefinition } from '../types';
import { HttpCodes } from '../http/codes';

export const UserErrors: Record<string, ErrorThrowDefinition> = {
  USER_NOT_FOUND: {
    name: 'USER_NOT_FOUND',
    message: 'User is not found',
    code: 1001,
    httpCode: HttpCodes.NOT_FOUND,
  },
  USER_HAS_NO_PERMISION: {
    name: 'USER_HAS_NO_PERMISION',
    message: 'Logged user for this action has no permision',
    code: 1002,
    httpCode: HttpCodes.UNAUTHORIZED,
  },
};
