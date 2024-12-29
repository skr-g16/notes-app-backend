const Hapi = require('@hapi/hapi');
const jwt = require('@hapi/jwt');
const Inert = require('@hapi/inert');
const clientError = require('./exceptions/clientError');
const path = require('path');

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

//collaboration
const collaborations = require('./api/collaborations');
const collaborationsService = require('./services/postgres/collaborationsServices');
const collaborationsValidator = require('./validator/collaborations');

//export
const _exports = require('./api/exports');
const producerServices = require('./services/rabbitmq/producerServices');
const exportsValidator = require('./validator/exports');

//uploads
const uploads = require('./api/uploads');
const StorageServices = require('./services/storage/storageServices');
const UploadsValidator = require('./validator/uploads');

//env
require('dotenv').config();

const init = async () => {
  const CollaborationsServices = new collaborationsService();
  const NotesServices = new notesService(CollaborationsServices);
  const UsersServices = new usersService();
  const AuthenticationsServices = new authenticationsService();
  const storageServices = new StorageServices(
    path.resolve(__dirname, 'api/uploads/file/images'),
  );
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
    {
      plugin: Inert,
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
    {
      plugin: _exports,
      options: {
        service: producerServices,
        validator: exportsValidator,
      },
    },
    {
      plugin: uploads,
      options: {
        service: storageServices,
        validator: UploadsValidator,
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
