const { registerNewUserHandler,
  getDetailResultHandler,
  deleteImageHandler,
  getListResultHandler
} = require("./handler");

const routes = [
  { // Register
    method: 'POST',
    path: '/register',
    handler: registerNewUserHandler,
  },
  { // List Hasil Analisis
    method: 'GET',
    path: '/image/{id}',
    handler: getListResultHandler,
  },
  { // Detail Hasil Analisis
    method: 'GET',
    path: '/image/{id}/{id_doc}',
    handler: getDetailResultHandler,
  },
  { // History
    method: 'DELETE',
    path: '/image/{id}/{id_doc}',
    handler: deleteImageHandler,
  },
]

module.exports = routes;