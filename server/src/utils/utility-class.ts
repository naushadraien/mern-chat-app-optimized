class ErrorHandler extends Error {
  statusCode: number;
  details: string[] | string | undefined;

  constructor(
    message: string,
    statusCode: number,
    details: string[] | string | undefined = undefined,
  ) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
  }
}

export default ErrorHandler;
