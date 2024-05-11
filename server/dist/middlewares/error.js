const errorMiddleware = (err, req, res, next) => {
    err.message || (err.message = 'Internal server error');
    err.statusCode || (err.statusCode = 500);
    err.details || (err.details = undefined);
    if (err.name === 'CastError')
        err.message = 'Invalid Id';
    return res.status(err.statusCode).json({
        success: false,
        message: err.message,
        details: err.details,
    });
};
const TryCatch = (fn) => async (req, res, next) => {
    try {
        await fn(req, res, next);
    }
    catch (error) {
        next(error);
    }
};
export { errorMiddleware, TryCatch };
