const { exportPayloadSchema } = require('./schema');
const InvariantError = require('../../exceptions/invariantError');

const exportsValidator = {
  validateExportPayload: (payload) => {
    const validationResult = exportPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = exportsValidator;
