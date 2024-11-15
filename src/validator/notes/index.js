const invariantError = require('../../exceptions/InvariantError');
const { notePayloadSchema } = require('./schema');
const notesValidator = {
  validateNotePayload: (payload) => {
    const validationResult = notePayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new invariantError(validationResult.error.message);
    }
  },
};

module.exports = notesValidator;
