class responseHandler {
  constructor(res, data, statusCode, message) {
    this.data = data;
    this.message = message;

    res.status(statusCode).json({
      statusCode,
      message,
      data: this.data,
    });
  }
}

module.exports = responseHandler;
