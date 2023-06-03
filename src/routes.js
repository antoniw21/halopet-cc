const { registerNewUserHandler,
  getResultHandler,
  deleteImageHandler} = require("./handler");

const routes = [
  { // Register
    method: 'POST',
    path: '/register',
    handler: registerNewUserHandler,
  },
  { // Hasil Analisis
    method: 'GET',
    path: '/image/{id}/{id_doc}',
    handler: getResultHandler,
  },
  { // History
    method: 'DELETE',
    path: '/image/{id}/{id_doc}',
    handler: deleteImageHandler,
  },
]

module.exports = routes;