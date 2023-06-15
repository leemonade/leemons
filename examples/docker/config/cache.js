if (process.env['REDIS_HOST']) {
  module.exports = {
    connection: {
      connector: 'redis',
      client: {
        host: process.env['REDIS_HOST'],
        port: process.env['REDIS_PORT'],
        name: process.env['REDIS_DB_NAME'],
        database: process.env['REDIS_DB_INDEX'],
      },
      replicas: true,
    },
  };
}

module.exports = {}
