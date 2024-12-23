const { ImagePayloadSchema } = require('./schema');
const invariantError = require('../../exceptions/invariantError');

const UploadsValidator = {
  validateImageHeaders: (headers) => {
    const validationResult = ImagePayloadSchema.validate(headers);
    if (validationResult.error) {
      throw new invariantError(validationResult.error.message);
    }
  },
};

module.exports = UploadsValidator;
