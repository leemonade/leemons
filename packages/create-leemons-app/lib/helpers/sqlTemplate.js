/* eslint-disable no-template-curly-in-string */
const _ = require('lodash');

const fullTemplate = {
  connector: 'bookshelf',
  settings: {
    client: '${client}',
    host: '${host}',
    port: '${port}',
    username: '${username}',
    password: '${password}',
    database: '${database}',
    filename: '${filename}',
  },
  options: {},
};

const general = ['connector', 'settings.client', 'options'];
const sqlite3 = ['settings.filename'];
const postgresql = [
  'settings.database',
  'settings.username',
  'settings.password',
  'settings.port',
  'settings.host',
];
const mysql = postgresql;

const engines = { sqlite3, postgresql, mysql };

module.exports = ({ sqlEngine }) =>
  JSON.stringify(_.pick(fullTemplate, [...general, ...engines[sqlEngine.toLowerCase()]]), '', 2);
