const checkPaths = require('./checkPaths');
const get = require('./get');

module.exports = async function getPlugins({ app }) {
  const plugins = await get({ app });

  return checkPaths({ plugin: plugins });
};
