const routes = (handler) => [
  {
    method: 'POST',
    path: '/exports/notes',
    handler: handler.postExportPlaylistHandler,
    options: {
      auth: 'notesapp_jwt',
    },
  },
];

module.exports = routes;
