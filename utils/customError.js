class ConflitError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 409;
  }
}

class UnAuthorizedError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 401;
  }
}

class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 404;
  }
}

class BadRequestError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 400;
  }
}

class UnprocessableEntity extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 422;
  }
}

class ForbiddenResourceError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 403;
  }
}

module.exports = {
  ConflitError,
  UnAuthorizedError,
  BadRequestError,
  UnprocessableEntity,
  ForbiddenResourceError,
  NotFoundError,
};
