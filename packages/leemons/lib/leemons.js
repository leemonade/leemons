const http = require('http');
const Koa = require('koa');
const Router = require('koa-router');
const Static = require('koa-static');
const nextjs = require('next');
const _ = require('lodash');
const chalk = require('chalk');
const leemonsUtils = require('leemons-utils');

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
const {
  loadProvidersModels,
  loadProvidersConfig,
  initializeProviders,
} = require('./core/plugins/loadProviders');

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

    this.backRouter.use(async (ctx, next) => {
      try {
        await next();
      } catch (err) {
        console.error(err);
        leemonsUtils.returnError(ctx, err);
      }
    });

    this.backRouter.use(bodyParser());
  }

  authenticatedMiddleware() {
    return async (ctx, next) => {
      try {
        const user = await this.plugins['users-groups-roles'].services.users.detailForJWT(
          ctx.headers.authorization
        );
        if (user) {
          ctx.state.user = user;
          return next();
        }
        ctx.status = 401;
        ctx.body = { status: 401, msg: 'Authorization required' };
        return undefined;
      } catch (err) {
        ctx.status = 401;
        ctx.body = { status: 401, msg: 'Authorization required' };
        return undefined;
      }
    };
  }

  permissionsMiddleware(allowedPermissions) {
    return async (ctx, next) => {
      const hasPermission = await this.plugins['users-groups-roles'].services.users.havePermission(
        ctx.state.user,
        allowedPermissions
      );
      if (hasPermission) {
        return next();
      }
      ctx.status = 401;
      ctx.body = { status: 401, msg: 'You do not have permissions' };
      return undefined;
    };
  }

  initPlugins() {
    const promises = [];
    _.forIn(this.plugins, (plugin) => {
      if (plugin && plugin.init && _.isFunction(plugin.init)) {
        promises.push(plugin.init());
      }
    });
    return Promise.allSettled(promises);
  }

  initProviders() {
    const promises = [];
    _.forIn(this.providers, (plugin) => {
      if (plugin && plugin.init && _.isFunction(plugin.init)) {
        promises.push(plugin.init());
      }
    });
    return Promise.allSettled(promises);
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
            const functions = [];
            if (route.authenticated) functions.push(this.authenticatedMiddleware());
            if (route.allowedPermissions)
              functions.push(this.permissionsMiddleware(route.allowedPermissions));
            functions.push(handler);
            this.backRouter[route.method.toLocaleLowerCase()](
              `/api/${plugin.name}${route.path}`,
              ...functions
            );
          }
        });
      }
    });

    this.backRouter.all(/\/.*/, (ctx) => {
      ctx.status = 404;
      ctx.body = { status: 404, message: 'Url not found' };
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

  async loadBack(loadedPlugins, loadedProviders) {
    await hooks.fireEvent('leemons::loadBack', { status: 'start' });

    /*
     * Load the providers' DataBase Model Descriptions
     */
    await hooks.fireEvent('leemons::loadProvidersModels', { status: 'start' });
    await loadProvidersModels(loadedProviders, this);
    await hooks.fireEvent('leemons::loadProvidersModels', { status: 'end' });

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

    await hooks.fireEvent('leemons::initializeProviders', { status: 'start' });
    await initializeProviders(this);
    await hooks.fireEvent('leemons::initializeProviders', { status: 'end' });

    await hooks.fireEvent('leemons::initializePlugins', { status: 'start' });
    await initializePlugins(this);
    await hooks.fireEvent('leemons::initializePlugins', { status: 'end' });

    await hooks.fireEvent('leemons::setMiddlewares', { status: 'start' });
    this.setMiddlewares();
    await hooks.fireEvent('leemons::setMiddlewares', { status: 'end' });

    await hooks.fireEvent('leemons::setRoutes', { status: 'start' });
    this.setRoutes();
    await hooks.fireEvent('leemons::setRoutes', { status: 'end' });

    await hooks.fireEvent('leemons::initProviders', { status: 'start' });
    await this.initProviders();
    await hooks.fireEvent('leemons::initProviders', { status: 'end' });

    await hooks.fireEvent('leemons::initPlugins', { status: 'start' });
    await this.initPlugins();
    await hooks.fireEvent('leemons::initPlugins', { status: 'end' });

    await hooks.fireEvent('leemons::loadBack', { status: 'end' });
  }

  async loadFront(plugins, providers) {
    await hooks.fireEvent('leemons::loadFront', { status: 'start' });
    await hooks.fireEvent('leemons::loadFrontPlugins', { status: 'start' });
    await loadFront(this, plugins, providers);
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

  async loadProvidersConfig() {
    await hooks.fireEvent('leemons::loadProviders', { status: 'start' });
    const loadedProviders = await loadProvidersConfig(this);
    await hooks.fireEvent('leemons::loadProviders', { status: 'end' });

    return loadedProviders;
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
    const providersConfig = await this.loadProvidersConfig();

    await Promise.all([
      /*
       * Load all the backend plugins, database and
       * setup the middlewares
       */
      await this.loadBack(loadedPlugins, providersConfig),
      /*
       * Load all the frontend plugins, build the app if needed
       * and set the middlewares.
       */
      await this.loadFront(loadedPlugins, providersConfig),
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
