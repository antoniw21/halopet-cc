const { registerNewUserHandler,
  getDetailResultHandler,
  deleteImageHandler,
  getListResultHandler,
  //
  getHomeProfileById,
  addSkinImage,
  getDetailProfileById,
  editProfileById
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
  //
  {
    method: 'GET',
    path: '/home/{id}',
    handler: getHomeProfileById,
  },
  {
    method: 'POST',
    path: '/image/{id}',
    handler: addSkinImage,
    options: {
      payload: {
        output: 'stream',
        parse: true,
        allow: 'multipart/form-data',
        multipart: true
      }
    }
  },
  {
    method: 'GET',
    path: '/profile/{id}',
    handler: getDetailProfileById,
  },
  {
    method: 'PUT',
    path: '/profile/{id}',
    handler: editProfileById,
  }
]

module.exports = routes;