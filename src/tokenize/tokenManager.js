/* eslint-disable no-unused-vars */
const jwt = require('@hapi/jwt');
const invariantError = require('../exceptions/invariantError');

const TokenManger = {
  generateAccessToken: (payload) =>
    jwt.token.generate(payload, process.env.ACCESS_TOKEN_KEY),
  generateRefreshToken: (payload) =>
    jwt.token.generate(payload, process.env.REFRESH_TOKEN_KEY),

  verifyRefreshToken: (refreshToken) => {
    try {
      const artifacts = jwt.token.decode(refreshToken);
      jwt.token.verify(artifacts, process.env.REFRESH_TOKEN_KEY);
      const { payload } = artifacts.decoded;
      return payload;
    } catch (error) {
      throw new invariantError('Refresh token tidak valid');
    }
  },
};
module.exports = TokenManger;
