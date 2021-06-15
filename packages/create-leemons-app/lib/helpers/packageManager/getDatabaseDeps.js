module.exports = (config) => {
  const { connector, client } = config.database.values;

  const CLIENTS = {
    postgresql: 'pg',
    sqlite3: 'sqlite3',
    mysql: 'mysql',
  };

  return [`leemons-connector-${connector}@1.0.0`, CLIENTS[client.toLowerCase()]];
};
