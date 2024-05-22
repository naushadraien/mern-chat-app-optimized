class ErrorHandler extends Error {
  statusCode: number;
  details: string[] | string | undefined;
  name: string;
  isOperational: boolean;
  status: 'error' | 'fail';

  constructor(
    // if custom error is thrown to this class, it will be caught here by the constructor and the message will be displayed
    message: string,
    statusCode: number,
    details: string[] | string | undefined = undefined,
    name?: string
  ) {
    super(message);
    this.name = name;
    this.statusCode = statusCode || 500;
    this.status = `${statusCode}`.startsWith('4') ? 'error' : 'fail';
    this.isOperational = true;
    this.details = details;

    Error.captureStackTrace(this, this.constructor);
  }
}

export default ErrorHandler;
