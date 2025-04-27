class AppError extends Error {
    constructor(message, statusCode = 500, data, errorInfo) {
        super(message);

        this.statusCode = statusCode;
        this.data = data ?? null;
        this.errorInfo = errorInfo;
        this.type = "AppError";
        this.location = this.stack.split("\n")[1].trim();
        Error.captureStackTrace(this, this.constructor);
        // this.errorInfo = errorInfo;
    }
}

module.exports = AppError;