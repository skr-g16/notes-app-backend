const Hapi = require('@hapi/hapi');
const notes = require('./api/notes');
const notesService = require('./services/postgres/notesServices');
const notesValidator = require('./validator/notes');
require('dotenv').config();

const init = async () => {
  const NotesServices = new notesService();
  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
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
      validator: notesValidator,
    },
  });
  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
