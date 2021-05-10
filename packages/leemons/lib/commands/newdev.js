const chokidar = require('chokidar');
const path = require('path');
const cluster = require('cluster');
const { Leemons } = require('../index');

module.exports = async ({ next }) => {
  const cwd = process.cwd();
  // eslint-disable-next-line import/no-dynamic-require, global-require
  const nextDir = next && path.isAbsolute(next) ? next : path.join(cwd, next || 'next/');
  process.env.next = nextDir;

  if (cluster.isMaster) {
    const configDir = process.env.CONFIG_DIR || 'config';

    /* TODO: Implement file watcher
     * Create watchers per service (config, front, back)
     * which forces reloads only on needed parts
     */
    const paths = [
      // Application config directory
      configDir,
      // Application package.json
      path.join(cwd, 'package.json'),
      // ignore leemons plugins and connectors
      path.join(__dirname, '../../../leemons-!(plugin|connector)**'),
      path.join(__dirname, '../../../leemons/**'),
    ];

    const watcher = chokidar.watch(paths, {
      cwd: process.cwd(),
      ignored: /(^|[/\\])\../, // ignore dotfiles
      ignoreInitial: true,
    });

    // watcher.on('ready', () => {
    //   console.log(watcher.getWatched());
    // });

    watcher.on('all', (event, changedPath) => {
      console.log(changedPath, event);
    });

    cluster.fork();
  } else {
    const leemons = new Leemons(console.log);
    process.env.PORT = 8080;
    await leemons.loadAppConfig();
    const pluginsConfig = await leemons.loadPluginsConfig();

    const frontDirs = [
      path.join(
        path.isAbsolute(leemons.dir.next)
          ? leemons.dir.next
          : path.join(leemons.dir.app, leemons.dir.next),
        '**'
      ),
      ...pluginsConfig.map((plugin) =>
        path.join(
          path.isAbsolute(plugin.dir.next)
            ? plugin.dir.next
            : path.join(plugin.dir.app, plugin.dir.next),
          '**'
        )
      ),
    ];

    const frontWatcher = chokidar.watch(frontDirs, {
      ignoreInitial: true,
      ignored: [
        /(^|[/\\])\../,
        /.*node_modules.*/,
        `${nextDir}/(dependencies|plugins|pages|jsconfig.json)`,
        /.*checksums.json.*/,
      ], // ignore dotfiles
    });

    frontWatcher.on('all', (event, filename) => {
      console.log(`Frontend was ${event} (${filename})`);
    });
    await leemons.loadFront(pluginsConfig);
    // /*
    //  * The dirs var contains all the directories read by leemons
    //  * Although exists some other files used (node_modules, leemons itself, etc)
    //  *
    //  * This info can be useful for knowing which server needs a restart.
    //  */
    // await leemons.loadBack(pluginsConfig);
    leemons.loaded = true;
    // await leemons.start();
  }
};
