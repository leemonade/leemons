/* eslint-disable no-template-curly-in-string */
const _ = require('lodash');

module.exports = ({ sqlEngine }) => {
  const fullTemplate = {
    connector: '${connector:bookshelf}',
    settings: {
      client: `\${client:${sqlEngine.toLowerCase()}}`,
      host: '${host:127.0.0.1}',
      port: '${port:3306}',
      user: '${username:leemons}',
      password: '${password:leemons}',
      database: '${database:leemons}',
      filename: '${filename:leemonsDB}',
    },
  };

  const general = ['connector', 'settings.client', 'options'];
  const sqlite3 = ['settings.filename'];
  const postgresql = [
    'settings.database',
    'settings.user',
    'settings.password',
    'settings.port',
    'settings.host',
  ];
  const mysql = postgresql;

  const engines = { sqlite3, postgresql, mysql };

  return JSON.stringify(
    _.pick(fullTemplate, [...general, ...engines[sqlEngine.toLowerCase()]]),
    '',
    2
  );
};
