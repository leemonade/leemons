module.exports = {
  connections: {
    mysql: {
      connector: 'bookshelf',
      useCustomRollback: process.env['USE_CUSTOM_ROLLBACK'] === 'true',
      settings: {
        client: 'mysql',
        database: process.env['DATABASE_DATABASE'],
        username: process.env['DATABASE_USERNAME'],
        password: process.env['DATABASE_PASSWORD'],
        port: process.env['DATABASE_PORT'],
        host: process.env['DATABASE_HOST'],
        pool: {
          min: 5,
          max: 50,
        },
      },
    },
    mongo: {
      connector: 'mongoose',
      settings: {
        database: process.env['NOSQL_DATABASE'],
        authDatabase: process.env['NOSQL_AUTH_DATABASE'],
        username: process.env['NOSQL_USERNAME'],
        password: process.env['NOSQL_PASSWORD'],
        port: process.env['NOSQL_PORT'],
        host: process.env['NOSQL_HOST'],
        srv: process.env['NOSQL_SRV'],
        // replicaSet: process.env['NOSQL_CLUSTER'],
        pool: {
          min: 5,
          max: 1000,
        },
      },
    },
  },
  defaultConnection: 'mysql',
};
