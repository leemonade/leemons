const checkPaths = require('./checkPaths');
const get = require('./get');

module.exports = async function getPlugins({ app }) {
  const plugins = await get({ app });

  const paths = await checkPaths({ plugin: plugins });

  const forceOrder = {
    'common-frontend-react': 0,
    'layout-frontend-react': 1,
  };

  return paths.sort((pluginA, pluginB) => {
    const aOrder = forceOrder[pluginA.name] ?? Number.MAX_SAFE_INTEGER;
    const bOrder = forceOrder[pluginB.name] ?? Number.MAX_SAFE_INTEGER;

    return aOrder - bOrder;
  });
};
