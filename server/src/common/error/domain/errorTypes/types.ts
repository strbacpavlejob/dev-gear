export interface InternalErrorLogData {
  errorClass: string;
  errorMessage: string;
  metadata: Record<string, string>;
}

export interface InternalHttpError {
  getHttpStatusCode(): number;
}
