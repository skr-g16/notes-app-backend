const Hapi = require('@hapi/hapi');
const notes = require('./api/notes');
const notesService = require('./services/inMemory/notesServices');

const init = async () => {
  const NotesServices = new notesService();
  const server = Hapi.server({
    port: 5000,
    host: process.env.NODE_ENV !== 'production' ? 'localhost' : '0.0.0.0',
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });
  await server.register({
    plugin: notes,
    options: {
      service: NotesServices,
    },
  });
  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
