const { envConfig } = require("../config/envConfig")
const AppError = require("./AppError")
const config = envConfig()

const errorHandler = (err, req, res, _next) => {
    let statusCode = 500
    let message = "Internal Server Error"
    let location = "Unknown"
    let type = "AppError"
    let data = null
    let errInfo = undefined

    if (err instanceof Error && err.sql) {
        statusCode = 500
        message = "Internal Server Error"
        location = "Unknown"
        type = "DB Error"
        location = { ...err, at: err?.stack?.split("\n")[13]?.trim() };
        errInfo = err
    }
    if (err instanceof AppError) {
        statusCode = err.statusCode;
        message = err.statusCode === 500 ? "Internal Server Error" : err.message;
        type = "AppError";
        data = err.data;
        location = err.location;
        errInfo = err?.errorInfo;
    } else if (err instanceof SyntaxError) {
        // Syntax error in JSON request
        statusCode = 400;
        message = "Invalid JSON syntax";
        type = `SyntaxError : ${err.message}`;
        location = err.stack.split("\n")[1].trim();
    } else {
        message = err?.message ?? "Internal Server Error"; // handles this case - throw error || throw new Error("Error Messsage")
    }

    if (err instanceof TypeError) {
        message = err.message;
        type = "TypeError";
        location = err.stack.split("\n")[1].trim();
    } else if (err instanceof ReferenceError) {
        message = "Internal Server Error";
        type = `ReferenceError : ${err.message}`;
        location = err.stack.split("\n")[1].trim();
    } else if (err instanceof RangeError) {
        message = err.message;
        type = "RangeError";
        location = err.stack.split("\n")[1].trim();
    }
    let errorInfoAll = {};

    if (config.ENVIRONMENT === "development" || config.ENVIRONMENT === "local") {
        errorInfoAll = {
            type: type,
            info: location,
            stack: err?.stack,
            errInfo: errInfo,
            env: config.ENVIRONMENT
        };
    } else {
        errorInfoAll = {
            type: null,
            info: null,
            stack: null,
            errInfo: errInfo,
            env: config.ENVIRONMENT
        };
    }

    res.status(statusCode).json({
        success: false,
        error: message,
        message,
        data: data ?? null,
        ...errorInfoAll
    });
}

module.exports = errorHandler;