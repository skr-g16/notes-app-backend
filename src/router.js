const { addnoteHandler, getAllnotesHandler, editnoteHandler, getByIdHandler, deletenoteHandler } = require('./handler');

const routes = [
  {
    method: 'POST',
    path: '/notes',
    handler: addnoteHandler,
  },
  {
    method: 'GET',
    path: '/notes',
    handler: getAllnotesHandler,
  },
  {
    method:"GET",
    path:"/notes/{id}",
    handler: getByIdHandler,
  },
  {
    method:"PUT",
    path:"/notes/{id}",
    handler: editnoteHandler,
  },
  {
    method:"DELETE",
    path:"/notes/{id}",
    handler: deletenoteHandler,
  }

];

module.exports = routes;