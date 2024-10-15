import { AxiosError } from 'axios';

import type { ServerError } from '../frappe_app/types';

export function handleError(error: AxiosError<ServerError>, errorMessage?: string): never {
  const response = error.response;
  throw new FrappeError({
    ...response?.data,
    httpStatus: response?.status,
    httpStatusText: response?.statusText,
    message: response?.data.message ?? errorMessage ?? 'There was an error.',
    exception: response?.data.exception ?? '',
  });
}

class FrappeError extends Error {
  readonly exception: string;
  readonly message: string;
  readonly _server_messages?: string;
  readonly exc_type?: string;
  readonly exc?: string;
  readonly httpStatus?: number;
  readonly httpStatusText?: string;

  constructor({ exception, message, _server_messages, exc_type, exc, httpStatus, httpStatusText }: ServerError) {
    super(message);
    this.name = 'FrappeError';
    this.exception = exception;
    this.message = message;
    this._server_messages = _server_messages;
    this.exc = exc;
    this.exc_type = exc_type;
    this.httpStatus = httpStatus;
    this.httpStatusText = httpStatusText;
  }
}
