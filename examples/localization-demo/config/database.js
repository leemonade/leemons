module.exports = () => {
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

  return {
    connections: { mysql },
    defaultConnection: 'mysql',
  };
};
