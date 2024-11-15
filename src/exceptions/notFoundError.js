const clientError = require('./clientError');
class notFoundError extends clientError {
  constructor(message) {
    super(message, 404);
    this.name = 'notFoundError';
  }
}
module.exports = notFoundError;
