const {
  PostAuthenticationPayloadSchema,
  PutAuthenticationPayloadSchema,
  DeleteAuthenticationPayloadSchema,
} = require('./schema');

const invariantError = require('../../exceptions/invariantError');

const authenticationsValidator = {
  validatePostAuthenticationPayload: (payload) => {
    const validationResult = PostAuthenticationPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new invariantError(validationResult.error.message);
    }
  },
  validatePutAuthenticationPayload: (payload) => {
    const validationResult = PutAuthenticationPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new invariantError(validationResult.error.message);
    }
  },
  validateDeleteAuthenticationPayload: (payload) => {
    const validationResult =
      DeleteAuthenticationPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new invariantError(validationResult.error.message);
    }
  },
};

module.exports = authenticationsValidator;
