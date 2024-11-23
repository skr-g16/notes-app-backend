const collaborationsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'collaborations',
  version: '1.0.0',
  register: async (
    server,
    { CollaborationsServices, NotesServices, validator },
  ) => {
    const CollaborationsHandler = new collaborationsHandler(
      CollaborationsServices,
      NotesServices,
      validator,
    );
    server.route(routes(CollaborationsHandler));
  },
};
