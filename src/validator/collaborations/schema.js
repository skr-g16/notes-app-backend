const joi = require('joi');

const collaborationPayloadSchema = joi.object({
  noteId: joi.string().required(),
  userId: joi.string().required(),
});

module.exports = { collaborationPayloadSchema };
