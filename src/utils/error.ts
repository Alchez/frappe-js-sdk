import type { Error } from '../frappe_app/types';

export function handleError(error: any, errorMessage?: string): never {
  throw {
    ...error.response.data,
    httpStatus: error.response.status,
    httpStatusText: error.response.statusText,
    message: error.response.data.message ?? (errorMessage || 'There was an error.'),
    exception: error.response.data.exception ?? '',
  } as Error;
}
