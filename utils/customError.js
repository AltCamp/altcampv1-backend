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

class BadRequestError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 401;
  }
}

class UnprocessableEntity extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 422;
  }
}

module.exports = {
  ConflitError,
  UnAuthorizedError,
  BadRequestError,
  UnprocessableEntity
};
