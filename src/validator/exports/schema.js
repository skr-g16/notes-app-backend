const Joi = require('joi');

const exportPayloadSchema = Joi.object({
  targetEmail: Joi.string().email().required(),
});

module.exports = { exportPayloadSchema };
