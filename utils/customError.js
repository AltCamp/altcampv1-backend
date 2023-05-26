class ConflictError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 409;
    this.error = message || 'Conflict';
  }
}

class UnAuthorizedError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 401;
    this.error = message || 'Unauthorised';
  }
}

class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 404;
    this.error = message || 'Not Found';
  }
}

class BadRequestError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 400;
    this.error = message || 'Bad Request';
  }
}

class UnprocessableEntity extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 422;
    this.error = 'Unprocessable Entity';
  }
}

class ForbiddenResourceError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 403;
    this.error = 'Forbidden';
  }
}

module.exports = {
  ConflictError,
  UnAuthorizedError,
  BadRequestError,
  UnprocessableEntity,
  ForbiddenResourceError,
  NotFoundError,
};
