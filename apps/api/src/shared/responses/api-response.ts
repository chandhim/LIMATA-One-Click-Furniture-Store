/**
 * Standard API response shape used across all endpoints.
 *
 * @template T  The type of the `data` payload.
 */
export type ApiResponse<T> = {
  success: boolean;
  message: string;
  data?: T;
};
