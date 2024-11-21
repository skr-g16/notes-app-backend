const clientError = require('./clientError');

class authenticationError extends clientError {
  constructor(message, statusCode = 401) {
    super(message, statusCode);
    this.name = 'authenticationError';
  }
}

module.exports = authenticationError;
