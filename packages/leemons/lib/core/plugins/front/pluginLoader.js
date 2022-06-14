/* eslint-disable no-param-reassign */

const path = require('path');
const fs = require('fs-extra');
const _ = require('lodash');

async function generatePluginLoader({ plugins, srcPath, srcChecksums, aliases, frontendPath }) {
  const file = `module.exports = {
  plugins: [
    ${plugins.map(([name]) => `'${name}'`).join(',\n\t\t')}
  ],
  frontPlugins: [${(
    await Promise.all(
      plugins
        .filter(([, plugin]) => _.get(plugin, 'hasFront', false))
        .map(([name, plugin]) =>
          fs
            .access(
              path.join(plugin.dir.app, plugin.dir.next, 'src', 'index.js'),
              fs.constants.R_OK
            )
            .then(() => [name, { ...plugin, hasInitFunc: true }])
            .catch(() => [name, { ...plugin, hasInitFunc: false }])
        )
    )
  )
    .filter(([, { hasInitFunc }]) => hasInitFunc)
    .map(
      ([name, plugin]) => `{
    name: '${name}',
    version: '${_.get(plugin, 'version', null)}',
    load: require('@${name}/index.js')
  }`
    )
    .join(',\n\t')}]
};`;
  const pluginFilePath = path.resolve(srcPath, 'plugins.js');
  // TODO: Make a md5
  const fileHash = file;
  if (fileHash !== srcChecksums['plugins.js']) {
    leemons.frontNeedsBuild = true;
    srcChecksums['plugins.js'] = fileHash;
    await fs.writeFile(pluginFilePath, file);
  }

  aliases[`@plugins`] = [`${path.relative(frontendPath, srcPath)}/plugins.js`];
}

module.exports = { generatePluginLoader };
