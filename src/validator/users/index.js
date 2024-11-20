const { userPayloadSchema } = require('./schema');
const invariantError = require('../../exceptions/invariantError');

const usersValidator = {
  validateUserPayload: (payload) => {
    const validationResult = userPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new invariantError(validationResult.error.message);
    }
  },
};

module.exports = usersValidator;
