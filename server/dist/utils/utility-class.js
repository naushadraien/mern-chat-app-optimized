class ErrorHandler extends Error {
    constructor(message, statusCode, details = undefined) {
        super(message);
        this.statusCode = statusCode;
        this.details = details;
    }
}
export default ErrorHandler;
