const Hapi = require('@hapi/hapi');
const jwt = require('@hapi/jwt');
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
const authenticationsService = require('./services/postgres/AuthenticationsServices');
const authenticationsValidator = require('./validator/authentications');
const TokenManager = require('./tokenize/tokenManager');

//collaboration
const collaborations = require('./api/collaborations');
const collaborationsService = require('./services/postgres/collaborationsServices');
const collaborationsValidator = require('./validator/collaborations');
//env
require('dotenv').config();

const init = async () => {
  const CollaborationsServices = new collaborationsService();
  const NotesServices = new notesService(CollaborationsServices);
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
  //register jwt
  await server.register([
    {
      plugin: jwt,
    },
  ]);
  //define auth strategy
  server.auth.strategy('notesapp_jwt', 'jwt', {
    keys: process.env.ACCESS_TOKEN_KEY,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: process.env.ACCESS_TOKEN_AGE,
    },
    validate: (artifacts) => ({
      isValid: true,
      credentials: {
        id: artifacts.decoded.payload.id,
      },
    }),
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
    {
      plugin: collaborations,
      options: {
        CollaborationsServices,
        NotesServices,
        validator: collaborationsValidator,
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
