const path = require('path');
const createFile = require('./createFile');

// TODO: Add more comments

module.exports = async (dir, config) => {
  const { connector, client, ...databaseSettings } = config.database.values;

  const envSettings = Object.keys(databaseSettings).map((key) => [
    key,
    `DATABASE_${key.toUpperCase()}`,
  ]);

  // database.js
  const databaseFileContent = `\
module.exports = {
  connections: {
    ${client}: {
      connector: '${connector}',
      settings: {
        client: '${client}',
        ${envSettings.map(([key, value]) => `${key}: process.env['${value}']`).join(',\n        ')},
      },
    },
  },
  defaultConnection: '${client}',
};
`;

  // .env (an array with all the vars)
  const envFileContent = envSettings.map(([key, value]) => `${value}='${databaseSettings[key]}'`);

  if (config.routes.values.config !== 'config') {
    envFileContent.push(`CONFIG_DIR="${config.routes.values.config}"`);
  }

  const databaseDir = path.join(dir, config.routes.values.config, 'database.js');
  const envDir = path.join(dir, config.routes.values.env);

  return Promise.all([
    createFile(databaseDir, databaseFileContent, 'database.js'),
    createFile(envDir, envFileContent.join('\n'), 'environment'),
  ]);
};
