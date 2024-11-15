const notesHandler = require('./handler');
const routes = require('./router');
module.exports = {
  name: 'notes',
  version: '1.0.0',
  register: async (server, { service }) => {
    const NotesHandler = new notesHandler(service);
    server.route(routes(NotesHandler));
  },
};
