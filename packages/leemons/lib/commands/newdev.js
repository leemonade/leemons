const chokidar = require('chokidar');
const path = require('path');
const cluster = require('cluster');
const { Leemons } = require('../index');
const loadFront = require('../core/plugins/front/loadFront');

async function setupFront(leemons, plugins, nextDir) {
  // #region fileWatcher
  const frontDirs = [
    path.join(
      path.isAbsolute(leemons.dir.next)
        ? leemons.dir.next
        : path.join(leemons.dir.app, leemons.dir.next),
      '**'
    ),
    ...plugins.map((plugin) =>
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
      /(^|[/\\])\../, // ignore dotfiles
      /.*node_modules.*/,
      `${nextDir}/(dependencies|plugins|pages|jsconfig.json)/**`,
      /.*checksums.json.*/,
    ],
  });

  const frontHandler = async (event, filename) => {
    console.log(`Frontend fired ${event} event. (${filename})`);
    await loadFront(leemons, plugins);
  };

  // #endregion

  await leemons.loadFront(plugins);

  frontWatcher.on('all', frontHandler);
}

async function setupBack(leemons, plugins) {
  // #region fileWatcher
  const backDirs = plugins.map((plugin) =>
    path.join(
      plugin.dir.app,
      `\
(${plugin.dir.models}|\
${plugin.dir.controllers}|\
${plugin.dir.services})`,
      '**'
    )
  );

  const backWatcher = chokidar.watch(backDirs, {
    ignoreInitial: true,
    ignored: [
      /(^|[/\\])\../, // ignore dotfiles
      /.*node_modules.*/,
      // `${nextDir}/(dependencies|plugins|pages|jsconfig.json)/**`,
      /.*checksums.json.*/,
    ],
  });

  const backHandler = async (event, filename) => {
    console.log(`Backend fired ${event} event. (${filename})`);

    // eslint-disable-next-line no-param-reassign
    leemons.backRouter.stack = [];
    leemons.loadBack(plugins);
  };

  // #endregion

  await leemons.loadBack(plugins);

  backWatcher.on('all', backHandler);
}

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

    watcher.on('all', (event, changedPath) => {
      console.log(changedPath, event);
    });

    cluster.fork();
  } else {
    const leemons = new Leemons(console.log);

    process.env.NODE_ENV = 'development';
    process.env.PORT = 8080;
    await leemons.loadAppConfig();
    const pluginsConfig = await leemons.loadPluginsConfig();

    await Promise.all([
      setupFront(leemons, pluginsConfig, nextDir),
      setupBack(leemons, pluginsConfig),
    ]);

    leemons.loaded = true;
    await leemons.start();
  }
};
