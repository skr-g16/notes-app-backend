const notesHandler = require('./handler');
const routes = require('./router');
module.exports = {
  name: 'notes',
  version: '1.0.0',
  register: async (server, { service, validator }) => {
    const NotesHandler = new notesHandler(service, validator);
    server.route(routes(NotesHandler));
  },
};
