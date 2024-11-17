const clientError = require('./clientError');

class invariantError extends clientError {
  constructor(message) {
    super(message);
    this.name = 'invariantError';
  }
}

module.exports = invariantError;
