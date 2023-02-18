import {
  ApiBadRequestResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiProperty,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { IsDate, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export interface ApiResponse<T> {
  success: boolean;
  data: T | null;
  code: number;
  errors: [{ title: string; code: number; message: string }] | null;
}

export const respondWithError = (
  title: string,
  code: number,
  message: string,
): ApiResponse<null> => {
  return {
    success: false,
    data: null,
    code: code,
    errors: [{ message, code, title }],
  };
};

export const respondWithSuccess = <T>(data: T): ApiResponse<T> => {
  return {
    success: true,
    data: data,
    code: 200,
    errors: null,
  };
};

export class ResponseError {
  @ApiProperty()
  message: string;

  @ApiProperty()
  code?: number;

  @ApiProperty()
  name?: string;

  @ApiProperty()
  payload?: undefined | Record<string, string>;
}

export class GenericResponse<T = null> {
  @ApiProperty({
    example: 200,
    type: 'number',
  })
  code = 200;

  @ApiProperty()
  success: boolean;

  @ApiProperty({
    example: [],
  })
  errors: ResponseError[] = [];

  @ApiProperty()
  data: T = null;

  constructor(data: T = null) {
    this.data = data;
  }
}

export class ListResponsePagination {
  @ApiProperty()
  page: number;

  @ApiProperty()
  limit: number;

  @ApiProperty()
  offset: number;

  @ApiProperty()
  totalPages: number;

  @ApiProperty()
  totalItems: number;
}

export class ListResponseMeta {
  @ApiProperty()
  itemCount: number;

  @ApiProperty()
  totalItems: number;

  @ApiProperty()
  itemsPerPage: number;

  @ApiProperty()
  totalPages: number;

  @ApiProperty()
  currentPage: number;
}
export class ListResponseLinks {
  @ApiProperty()
  first: string;

  @ApiProperty()
  previous: string;

  @ApiProperty()
  next: string;

  @ApiProperty()
  last: string;
}

export class SuccessDeterminationResponseData {
  @ApiProperty()
  success: boolean;
}

export class SuccessDeterminationResponse extends GenericResponse<SuccessDeterminationResponseData> {
  @ApiProperty({
    type: SuccessDeterminationResponseData,
  })
  data: SuccessDeterminationResponseData;
}

export class ListResponse<T> extends GenericResponse<T[]> {
  @ApiProperty()
  pagination: ListResponsePagination;
}

export class PaginatedGenericResponse<T> extends GenericResponse<T> {
  @ApiProperty()
  pagination: ListResponsePagination;
}

export const createGenericResponse = <T>(
  data: T | null,
  errors: ResponseError[] = [],
  code = 200,
): GenericResponse<T> => ({
  code,
  data,
  success: errors && errors.length ? false : true,
  errors,
});

export const createListResponse = <T>(
  items: T[],
  pagination: ListResponsePagination = {
    page: 0,
    limit: 0,
    offset: 0,
    totalPages: 0,
    totalItems: 0,
  },
  errors?: ResponseError[],
): ListResponse<T> => ({
  ...createGenericResponse(items ?? [], errors),
  pagination,
});

export const createPaginatedGenericResponse = <T>(
  items: T,
  pagination: ListResponsePagination = {
    page: 0,
    limit: 0,
    offset: 0,
    totalPages: 0,
    totalItems: 0,
  },
  errors?: ResponseError[],
): PaginatedGenericResponse<T> => ({
  ...createGenericResponse(items ?? undefined, errors),
  pagination,
});

export class UnauthorizedResponse extends GenericResponse<null> {
  @ApiProperty({
    example: false,
  })
  success = false;

  @ApiProperty({
    example: 403,
  })
  code = 403;

  @ApiProperty({
    type: [ResponseError],
    example: [
      {
        message: 'UNAUTHORIZED',
        code: 403,
      },
    ],
  })
  errors: ResponseError[] = [
    {
      message: 'UNAUTHORIZED',
      code: 403,
    },
  ];

  @ApiProperty()
  data: null;
}

export class NotFoundResponse extends GenericResponse<null> {
  @ApiProperty({
    example: false,
  })
  success = false;

  @ApiProperty({
    type: [ResponseError],
    example: [
      {
        message: 'NOT_FOUND',
        code: 404,
      },
    ],
  })
  errors: ResponseError[] = [
    {
      message: 'NOT_FOUND',
      code: 404,
    },
  ];

  @ApiProperty()
  data: null;
}

export class BadRequestResponse extends GenericResponse<null> {
  @ApiProperty({
    example: false,
  })
  success = false;

  @ApiProperty({
    type: [ResponseError],
    example: [
      {
        message: 'An error ocurred',
        code: 1000,
        name: 'ERROR_NAME',
        payload: {
          key: 'value',
        },
      },
    ],
  })
  errors: ResponseError[] = [
    {
      message: 'FIELD_ERROR_MESSAGE',
      code: 400,
    },
  ];

  @ApiProperty()
  data: null;
}

export const HttpApiUnauthorizedResponse = (): MethodDecorator &
  ClassDecorator =>
  ApiUnauthorizedResponse({
    description: 'Unauthorized.',
    type: UnauthorizedResponse,
  });

export const HttpApiNotFoundResponse = (): MethodDecorator & ClassDecorator =>
  ApiNotFoundResponse({
    description: 'Not found.',
    type: NotFoundResponse,
  });

export const HttpApiBadRequestResponse = (): MethodDecorator & ClassDecorator =>
  ApiBadRequestResponse({
    description: 'Bad request.',
    type: BadRequestResponse,
  });

export const HttpApiNoContentResponse = (): MethodDecorator & ClassDecorator =>
  ApiNoContentResponse({
    description: 'Success (no content).',
  });

export abstract class BaseListFilterQuery {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  skip: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  limit: number;
}

export abstract class ExtendedListFilterQuery extends BaseListFilterQuery {
  @ApiProperty({
    required: false,
  })
  @IsString()
  search?: string;

  @ApiProperty({
    required: false,
  })
  @IsDate()
  dateFrom?: Date;

  @ApiProperty({
    required: false,
  })
  @IsDate()
  dateTo?: Date;
}
