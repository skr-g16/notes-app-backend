const authenticationsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'authentications',
  version: '1.0.0',
  register: async (
    server,
    { authenticationsServices, usersServices, tokenManager, validator },
  ) => {
    const AuthenticationsHandler = new authenticationsHandler(
      authenticationsServices,
      usersServices,
      tokenManager,
      validator,
    );
    server.route(routes(AuthenticationsHandler));
  },
};
