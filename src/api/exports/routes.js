const routes = (handler) => [
  {
    method: 'POST',
    path: '/export/notes',
    handler: handler.postExportPlaylistHandler,
    options: {
      auth: 'notesapp_jwt',
    },
  },
];

module.exports = routes;
