const http = require('http');
const Koa = require('koa');
const Router = require('koa-router');
const Static = require('koa-static');
const request = require('request');
// const nextjs = require('next');
const execa = require('execa');
const stream = require('stream');
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
      ctx._startAt = new Date();
      this.log.http(
        chalk`Start connection to {magenta ${ctx.method}} {green ${ctx.path}} from {yellow ${ctx.ip}}`
      );
      await next();
    });

    this.backRouter.use(async (ctx, next) => {
      try {
        await next();
        const start = ctx._startAt.getTime();
        const end = new Date().getTime();
        this.log.http(
          chalk`  End connection to {magenta ${ctx.method}} {green ${ctx.path}} from {yellow ${
            ctx.ip
          }} {gray ${end - start} ms}`
        );
      } catch (err) {
        console.error(err);
        leemons.log.error(err.message);
        leemonsUtils.returnError(ctx, err);
      }
    });

    this.backRouter.use(bodyParser());
  }

  authenticatedMiddleware(authenticated) {
    return async (ctx, next) => {
      try {
        let authorization = ctx.headers.authorization;
        try {
          authorization = JSON.parse(authorization);
        } catch (e) {}
        if (_.isString(authorization)) {
          const user = await this.plugins.users.services.users.detailForJWT(authorization);
          if (user) {
            ctx.state.userSession = user;
            return next();
          }
        } else {
          const user = await this.plugins.users.services.users.detailForJWT(authorization[0], true);
          const userAgents = await Promise.all(
            _.map(authorization, (auth) =>
              this.plugins.users.services.users.detailForJWT(auth, false, true)
            )
          );
          if (user && userAgents.length) {
            user.userAgents = userAgents;
            ctx.state.userSession = user;
            return next();
          }
        }
        if (_.isObject(authenticated) && authenticated.nextWithoutSession) {
          ctx.state.userSession = null;
          return next();
        }
        ctx.status = 401;
        ctx.body = { status: 401, msg: 'Authorization required' };
        return undefined;
      } catch (err) {
        if (_.isObject(authenticated) && authenticated.nextWithoutSession) {
          ctx.state.userSession = null;
          return next();
        }
        ctx.status = 401;
        ctx.body = { status: 401, msg: 'Authorization required' };
        return undefined;
      }
    };
  }

  permissionsMiddleware(allowedPermissions) {
    return async (ctx, next) => {
      try {
        // TODO: Ahora mismo con que cualquiera de los user auth tenga permiso pasa al controlador, aqui entra la duda de si se le deberian de pasar todos los user auth o solo los que tengan permiso, por qe es posible que relacione algun dato a un user auth que realmente no deberia de tener acceso
        // TODO QUITAR LOS USER AUTH QUE NO TENGAN EL PERMISO

        const hasPermission = await this.plugins.users.services.users.hasPermissionCTX(
          ctx.state.userSession,
          allowedPermissions
        );
        if (hasPermission) {
          return next();
        }
        ctx.status = 401;
        ctx.body = { status: 401, msg: 'You do not have permissions' };
        return undefined;
      } catch (err) {
        console.error(err);
      }
    };
  }

  async initPlugins() {
    const plugins = _.orderBy(this.plugins, (plugin) => plugin.config?.config?.initOrder || 0, [
      'desc',
    ]);

    const results = [];

    let plugin;
    for (let i = 0, l = plugins.length; i < l; i++) {
      plugin = plugins[i];
      if (plugin && plugin.init && _.isFunction(plugin.init)) {
        // eslint-disable-next-line no-await-in-loop
        results.push(await plugin.init());
      }
    }
    return results;
  }

  async initProviders() {
    const providers = _.orderBy(
      this.providers,
      (provider) => provider.config?.config?.initOrder || 0,
      ['desc']
    );

    const results = [];

    let provider;
    for (let i = 0, l = providers.length; i < l; i++) {
      provider = providers[i];
      if (provider && provider.init && _.isFunction(provider.init)) {
        // eslint-disable-next-line no-await-in-loop
        results.push(await provider.init());
      }
    }
    return results;
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
            if (route.authenticated)
              functions.push(this.authenticatedMiddleware(route.authenticated));
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
      ctx.req.pipe(request(`http://localhost:3000${ctx.req.url}`)).pipe(ctx.res);
      // await this.frontHandler(ctx.req, ctx.res);
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
    // this.front = nextjs({
    //   dir: this.dir.next,
    //   dev: process.env.NODE_ENV === 'development',
    // });

    await buildFront();
    // this.frontHandler = this.front.getRequestHandler();

    // stream transformer for listening ready event from frontend
    // Emit a ready event when next is listening
    const nextTransform = (readyCallback) =>
      new stream.Transform({
        transform: (chunk, encoding, callback) => {
          callback(null, chunk);

          const data = chunk.toString();
          if (
            data
              // ignore colors
              .replace(
                // eslint-disable-next-line no-control-regex
                /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g,
                ''
              )
              // in dev. and prod. next logs a line like: ready - listening on:
              .startsWith('ready')
          ) {
            readyCallback();
          }
        },
      });

    const frontLogger = (level) =>
      new stream.Writable({
        write: (chunk) => {
          this.log[level](chunk.toString(), { labels: ['front'] });
        },
      });

    // When next is prepared
    await hooks.fireEvent('leemons::prepareFrontend', { status: 'start' });
    const prepareFront = ora('Starting frontend server').start();
    // Start production next app
    const start = execa.command(
      `yarn --cwd ${leemons.dir.next} ${process.env.NODE_ENV === 'production' ? 'start' : 'dev'}`,
      {
        ...process.env,
        FORCE_COLOR: true,
      }
    );
    // Log the stdout and stderr
    start.stdout
      .pipe(
        nextTransform(async () => {
          prepareFront.succeed('Frontend server started');
          await hooks.fireEvent('leemons::prepareFrontend', { status: 'end' });
          await hooks.fireEvent('leemons::loadFront', { status: 'end' });
          this.setFrontRoutes();
        })
      )
      .pipe(frontLogger('info'));
    start.stderr.pipe(frontLogger('error'));
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
