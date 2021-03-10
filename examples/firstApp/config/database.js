module.exports = () => {
  const sqlite = {
    connector: 'bookshelf',
    settings: {
      client: 'sqlite',
      filename: '.tmp/data.db',
    },
    options: {
      // debug: true,
      useNullAsDefault: true,
    },
  };

  const postgres = {
    connector: 'bookshelf',
    settings: {
      client: 'postgres',
      database: 'leemons',
      username: 'leemons',
      password: 'leemons',
      port: 5432,
      host: 'localhost',
    },
    options: {},
  };

  const mysql = {
    connector: 'bookshelf',
    settings: {
      client: 'mysql',
      database: 'leemons',
      username: 'leemons',
      password: 'leemons',
      port: 3306,
      host: 'localhost',
    },
    options: {},
  };

  const mongo = {
    connector: 'mongoose',
    settings: {
      database: 'leemons',
      username: 'root',
      password: 'leemons',
      port: 27017,
      host: 'localhost',
    },
    options: {},
  };

  const db = {
    mysql,
    sqlite,
    postgres,
    mongo,
  };
  return {
    connections: { mysql },
    defaultConnection: 'mysql',
  };
};
