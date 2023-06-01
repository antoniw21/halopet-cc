const { registerNewUserHandler } = require("./handler");

const routes = [
  {
    method: 'POST',
    path: '/register',
    handler: registerNewUserHandler,
  },
]

module.exports = routes;