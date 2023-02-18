import { ErrorThrowDefinition } from '../../types';
import { InternalError } from './errorTypes';

export const buildError = (
  errorDefinition: ErrorThrowDefinition,
  payload = {},
): InternalError => {
  const internalError = new InternalError(
    errorDefinition?.name,
    errorDefinition?.message,
    errorDefinition?.code,
    payload,
    errorDefinition?.httpCode,
  );

  return internalError;
};

export const throwError = (
  errorDefinition: ErrorThrowDefinition,
  payload: Record<string, unknown> = {},
): void => {
  throw buildError(errorDefinition, payload);
};
