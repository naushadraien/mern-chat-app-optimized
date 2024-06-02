class ErrorHandler extends Error {
  statusCode: number;
  details: string[] | string | undefined;
  name: string;
  isOperational: boolean;
  status: 'error' | 'fail';
  dbErrorcode?: number;

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
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true; // this error class is only used for operational errors i.e someone request the server without giving the required data or required fields
    this.details = details;

    Error.captureStackTrace(this, this.constructor); // this will capture the stack trace of the error and will show the exact location of the error where it occurred
  }
}

export default ErrorHandler;

// there are two types of errors in nodejs
// 1. operational errors: these are the errors that are caused by the user or the client, for example, if the user sends a request without the required data or required fields, then this error will be thrown
// 2. programming errors: these are the errors that are caused by the developer, for example, if the developer writes the wrong code, then this error will be thrown
// this class is only used for operational errors

/*
new ErrorHandler('User not found', 404) 
means we are passing message and status code to the constructor of the ErrorHandler class 
*/
