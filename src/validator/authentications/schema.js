const joi = require('joi');

const PostAuthenticationPayloadSchema = joi.object({
  username: joi.string().required(),
  password: joi.string().required(),
});

const PutAuthenticationPayloadSchema = joi.object({
  refreshToken: joi.string().required(),
});

const DeleteAuthenticationPayloadSchema = joi.object({
  refreshToken: joi.string().required(),
});

module.exports = {
  PostAuthenticationPayloadSchema,
  PutAuthenticationPayloadSchema,
  DeleteAuthenticationPayloadSchema,
};
