const clientError = require('./clientError');

class authorizationError extends clientError {
  constructor(message) {
    super(message, 403);
    this.name = 'AuthorizationError';
  }
}

module.exports = authorizationError;
