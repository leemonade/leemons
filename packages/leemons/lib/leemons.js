const http = require('http');
const Koa = require('koa');
const Router = require('koa-router');
const Static = require('koa-static');
const nextjs = require('next');
const _ = require('lodash');
const chalk = require('chalk');

const bodyParser = require('koa-bodyparser');

const { createDatabaseManager } = require('leemons-database');
const hooks = require('leemons-hooks');
const ora = require('ora');
const { loadConfiguration } = require('./core/config/loadConfig');
const { loadModels } = require('./core/model/loadModel');
const {
  initializePlugins,
  loadPluginsModels,
  loadPluginsConfig,
} = require('./core/plugins/loadPlugins');
const buildFront = require('./core/front/build');
const loadFront = require('./core/plugins/front/loadFront');

class Leemons {
  constructor(log) {
    // expose leemons globally
    global.leemons = this;
    // expose logging system to leemons
    this.log = log;

    log.verbose('New leemons');

    const timers = {};
    hooks.addAction('*', ({ eventName, args: [options] }) => {
      const now = new Date();
      switch (_.get(options, 'status', null)) {
        case 'start':
          _.set(timers, eventName, now);
          break;
        case 'end': {
          const started = _.get(timers, eventName, now);
          const time = new Date(now - started);

          const minutes = time.getMinutes();
          const seconds = time.getSeconds();
          const milliseconds = time.getMilliseconds();
          const timeString = `${
            (minutes ? `${minutes}min ` : '') + (seconds ? `${seconds}s ` : '')
          }${milliseconds}ms`;

          delete timers[eventName];
          this.log.debug(
            chalk`The event {green ${eventName}} was running during {magenta ${timeString}}`
          );
          break;
        }
        default:
      }
    });

    // Initialize the reload method (generate a "state" for it)
    this.reload();

    this.app = new Koa();
    this.frontRouter = new Router();
    this.backRouter = new Router();

    this.initServer();

    this.loaded = false;
    this.started = false;
  }

  // Set KOA as requestHandler
  handleRequest(req, res) {
    if (!this.requestHandler) {
      this.requestHandler = this.app.callback();
    }
    return this.requestHandler(req, res);
  }

  // Initialize the server config with http server
  initServer() {
    // Add front router to KOA
    this.app.use(this.frontRouter.routes());
    // Add backRouter to app
    this.app.use(this.backRouter.routes());

    // Use http-server for being able to reuse it (for example with webSockets)
    this.server = http.createServer(this.handleRequest.bind(this));

    // TODO: Handle Errors and connections

    // Function for server's clean exit
    this.server.destroy = (cb = () => {}) => {
      this.server.close(cb);
      // TODO: Close all connections
    };
  }

  // Invoke a reload action on master cluster
  reload() {
    // Initialize a state for reloading
    const state = {
      isReloading: false,
    };

    // Overwrite this.reload for being able to use a private state
    this.reload = () => {
      if (!state.isReloading && process.send) {
        // Send message to master process
        process.send('reload');
        state.isReloading = true;
        return true;
      }

      return false;
    };
  }

  // Initialize all the middlewares
  setMiddlewares() {
    this.backRouter.use(async (ctx, next) => {
      this.log.http(
        chalk`New connection to {magenta ${ctx.method}} {green ${ctx.path}} from {yellow ${ctx.ip}}`
      );
      await next();
    });

    this.backRouter.use(bodyParser());
  }

  // Initialize the api endpoints
  setRoutes() {
    // Plugins
    this.backRouter.get('/api/reload', (ctx) => {
      ctx.body = { reloading: true };
      this.reload();
    });

    Object.entries(this.plugins).forEach(([, plugin]) => {
      if (_.isArray(plugin.routes)) {
        plugin.routes.forEach((route) => {
          if (
            route.handler &&
            route.path &&
            route.method &&
            _.get(plugin.controllers, route.handler)
          ) {
            const handler = _.get(plugin.controllers, route.handler);
            this.backRouter[route.method.toLocaleLowerCase()](
              `/api/${plugin.name}${route.path}`,
              handler
            );
          }
        });
      }
    });
  }

  // Initialize the frontend handler
  async setFrontRoutes() {
    // Next.js public path
    this.app.use(Static('./next/public'));

    // Make next.js handle with all non /api requests
    this.frontRouter.get(/(?!^\/api)^\/.*/, async (ctx) => {
      await this.frontHandler(ctx.req, ctx.res);
      // Stop Koa handling the request
      ctx.respond = false;
    });
  }

  query(model, plugin) {
    return this.db.query(model, plugin);
  }

  async loadBack(loadedPlugins) {
    await hooks.fireEvent('leemons::loadBack', { status: 'start' });
    /*
     * Load the plugins' DataBase Model Descriptions
     */
    await hooks.fireEvent('leemons::loadPluginsModels', { status: 'start' });
    await loadPluginsModels(loadedPlugins, this);
    await hooks.fireEvent('leemons::loadPluginsModels', { status: 'end' });

    /*
     * Load other DataBase Model Descriptions
     */
    await hooks.fireEvent('leemons::loadModels', { status: 'start' });
    loadModels(this);
    await hooks.fireEvent('leemons::loadModels', { status: 'end' });

    /*
     * Create a DatabaseManager for managing the database connections and models
     */
    this.db = createDatabaseManager(this);

    // Initialize all database connections
    await hooks.fireEvent('leemons::initDB', { status: 'start' });
    await this.db.init();
    await hooks.fireEvent('leemons::initDB', { status: 'end' });

    await hooks.fireEvent('leemons::initializePlugins', { status: 'start' });
    await initializePlugins(this);
    await hooks.fireEvent('leemons::initializePlugins', { status: 'end' });

    this.setMiddlewares();
    this.setRoutes();
    await hooks.fireEvent('leemons::loadBack', { status: 'end' });
  }

  async loadFront(plugins) {
    await hooks.fireEvent('leemons::loadFront', { status: 'start' });
    await hooks.fireEvent('leemons::loadFrontPlugins', { status: 'start' });
    await loadFront(this, plugins);
    await hooks.fireEvent('leemons::loadFrontPlugins', { status: 'end' });

    // Initialize next
    this.front = nextjs({
      dir: this.dir.next,
      dev: process.env.NODE_ENV === 'development',
    });

    await buildFront();
    this.frontHandler = this.front.getRequestHandler();

    // When next is prepared
    await hooks.fireEvent('leemons::prepareFrontend', { status: 'start' });
    const prepareFront = ora('Starting frontend server').start();
    return this.front.prepare().then(async () => {
      prepareFront.succeed('Frontend server started');
      await hooks.fireEvent('leemons::prepareFrontend', { status: 'end' });

      this.setFrontRoutes();

      await hooks.fireEvent('leemons::loadFront', { status: 'end' });
    });
  }

  async loadAppConfig() {
    await hooks.fireEvent('leemons::loadConfig', { status: 'start' });
    this.config = (await loadConfiguration(this)).configProvider;
    await hooks.fireEvent('leemons::loadConfig', { status: 'end' });

    if (this.config.get('config.insecure', false)) {
      this.log.warn(
        'The app is running in insecure mode, this means all the plugins can require any file in your computer'
      );
    }

    return this.config;
  }

  async loadPluginsConfig() {
    await hooks.fireEvent('leemons::loadPlugins', { status: 'start' });
    const loadedPlugins = await loadPluginsConfig(this);
    await hooks.fireEvent('leemons::loadPlugins', { status: 'end' });

    return loadedPlugins;
  }

  // Load all apps
  async load() {
    await hooks.fireEvent('leemons::load', { status: 'start' });
    if (this.loaded) {
      return true;
    }

    await this.loadAppConfig();
    /*
     * Load all the installed plugins configuration, check for duplicated
     * plugins and save plugin' env
     */
    const loadedPlugins = await this.loadPluginsConfig();

    await Promise.all([
      /*
       * Load all the backend plugins, database and
       * setup the middlewares
       */
      await this.loadBack(loadedPlugins),
      /*
       * Load all the frontend plugins, build the app if needed
       * and set the middlewares.
       */
      await this.loadFront(loadedPlugins),
    ]);

    this.loaded = true;
    await hooks.fireEvent('leemons::load', { status: 'end' });

    return true;
  }

  // Start the app
  async start() {
    if (this.started) {
      return;
    }
    await this.load();

    this.server.listen(process.env.PORT, () => {
      this.log.debug(`Listening on http://localhost:${process.env.PORT}`);
      if (process.send) {
        process.send('running');
      }
      this.started = true;
    });
  }
}

module.exports = (...args) => {
  const leemons = new Leemons(...args);
  return leemons;
};
module.exports.Leemons = Leemons;
