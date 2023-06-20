class responseHandler {
  constructor(res, data, statusCode, message, meta = null) {
    this.data = data;
    this.message = message;
    this.meta = meta;

    res.status(statusCode).json({
      statusCode,
      message,
      data: this.data,
      ...(this.meta && { meta: this.meta }),
    });
  }
}

module.exports = responseHandler;
