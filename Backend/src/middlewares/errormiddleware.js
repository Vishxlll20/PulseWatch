import config from "../config/config.js";
const errorHandler = (err, req, res, next) => {
    const statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : (err.status || 500);
    
    if (config.NODE_ENV !== 'production') {
        console.error(err.stack);
    }

    res.status(statusCode).json({
        success: false,
        message: err.message || 'Internal Server Error',
        stack: config.NODE_ENV === 'production' ? null : err.stack,
    });
};

export default errorHandler;