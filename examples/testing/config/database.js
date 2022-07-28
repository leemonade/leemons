module.exports = {
  connections: {
    mysql: {
      connector: 'bookshelf',
      settings: {
        client: 'mysql',
        database: 'leemons',
        username: 'leemons',
        password: 'leemons',
        port: 3306,
        host: 'localhost',
        pool: {
          min: 5,
          max: 1000,
        },
      },
    },
  },
  defaultConnection: 'mysql',
};
