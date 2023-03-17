class AppError extends Error {
  constructor(message, statusCode) {
    super(message, statusCode);

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? message : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
