module.exports = {
  connections: {
    mysql: {
      connector: 'bookshelf',
      settings: {
        client: 'mysql',
        database: process.env['DATABASE_DATABASE'],
        username: process.env['DATABASE_USERNAME'],
        password: process.env['DATABASE_PASSWORD'],
        port: process.env['DATABASE_PORT'],
        host: process.env['DATABASE_HOST'],
        pool: {
          min: 5,
          max: 1000,
        },
      },
    },
  },
  defaultConnection: 'mysql',
};
