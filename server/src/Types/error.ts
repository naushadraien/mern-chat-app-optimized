export interface ErrorResponse {
  success: boolean;
  status: string;
  name: string;
  message: string;
  stack?: string;
  schemaError?: string[] | string | undefined;
}
