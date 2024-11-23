const collaborationPayloadSchema = require('./schema');
const invariantError = require('../../exceptions/invariantError');

const collaborationsValidator = {
  validatePostCollaborationPayload: (payload) => {
    const validationResult = collaborationPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new invariantError(validationResult.error.message);
    }
  },
};

module.exports = collaborationsValidator;
