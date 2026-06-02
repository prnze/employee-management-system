import { ApiError } from '@core/models/api.models';

export function mapApiError(error: unknown): ApiError {
  if (typeof error === 'object' && error !== null && 'status' in error) {
    const status = Number((error as { status: unknown }).status);
    return {
      status,
      code: status === 403 ? 'FORBIDDEN' : status === 401 ? 'UNAUTHORIZED' : 'API_ERROR',
      message: status === 403 ? 'You do not have access to this action.' : 'Something went wrong. Please try again.'
    };
  }
  return { status: 500, code: 'UNKNOWN_ERROR', message: 'Unexpected error occurred.' };
}
