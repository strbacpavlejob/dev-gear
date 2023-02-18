import { ErrorThrowDefinition } from '../types';
import { HttpCodes } from '../http/codes';

export const ProductErrors: Record<string, ErrorThrowDefinition> = {
  PRODUCT_NOT_FOUND: {
    name: 'PRODUCT_NOT_FOUND',
    message: 'Product is not found',
    code: 2001,
    httpCode: HttpCodes.NOT_FOUND,
  },
};
