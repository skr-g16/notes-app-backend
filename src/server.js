const Hapi = require('@hapi/hapi');
const clientError = require('./exceptions/clientError');

//notes
const notes = require('./api/notes');
const notesService = require('./services/postgres/notesServices');
const notesValidator = require('./validator/notes');

//users
const users = require('./api/users');
const usersService = require('./services/postgres/usersServices');
const usersValidator = require('./validator/users');

//authentications
const authentications = require('./api/authentications');
const authenticationsService = require('./services/postgres/authenticationsServices');
const authenticationsValidator = require('./validator/authentications');
const TokenManager = require('./tokenize/tokenManager');
//env
require('dotenv').config();

const init = async () => {
  const NotesServices = new notesService();
  const UsersServices = new usersService();
  const AuthenticationsServices = new authenticationsService();
  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });
  await server.register([
    {
      plugin: notes,
      options: {
        service: NotesServices,
        validator: notesValidator,
      },
    },
    {
      plugin: users,
      options: {
        service: UsersServices,
        validator: usersValidator,
      },
    },
    {
      plugin: authentications,
      options: {
        authenticationsServices: AuthenticationsServices,
        usersServices: UsersServices,
        validator: authenticationsValidator,
        tokenManager: TokenManager,
      },
    },
  ]);
  //custom error
  server.ext('onPreResponse', (request, h) => {
    const { response } = request;

    if (response instanceof clientError) {
      const newResponse = h.response({
        status: 'fail',
        message: response.message,
      });
      newResponse.code(response.statusCode);
      return newResponse;
    }

    return h.continue;
  });

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
