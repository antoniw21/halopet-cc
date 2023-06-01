const Hapi = require('@hapi/hapi');
const routes = require('./routes');
require('dotenv').config();

const init = async () => {
  const server = Hapi.server({
      port: process.env.PORT,
      host: `${process.env.HOST}`,
  });

  server.route(routes);

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
}

init();