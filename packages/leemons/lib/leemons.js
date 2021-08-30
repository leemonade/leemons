const http = require('http');
const Koa = require('koa');
const Router = require('koa-router');
const Static = require('koa-static');
const request = require('request');
const events = require('events');
const execa = require('execa');
const _ = require('lodash');
const chalk = require('chalk');
const bodyParser = require('koa-bodyparser');
const ora = require('ora');
const uuid = require('uuid');

const leemonsUtils = require('leemons-utils');
const { createDatabaseManager } = require('leemons-database');

const { loadConfiguration } = require('./core/config/loadConfig');
const { loadCoreModels } = require('./core/model/loadModel');
const buildFront = require('./core/front/build');
const loadFront = require('./core/plugins/front/loadFront');
const { loadExternalFiles } = require('./core/plugins/loadExternalFiles');
const { PLUGIN_STATUS } = require('./core/plugins/pluginsStatus');
const { nextTransform, frontLogger } = require('./core/front/streams');

class Leemons {
  constructor(log) {
    // expose leemons globally
    global.leemons = this;
    // expose logging system to leemons
    this.log = log;

    this.canReloadFrontend = true;
    this.canReloadBackend = true;

    log.verbose('New leemons');

    const timers = new Map();

    // Initialize the reload method (generate a "state" for it)
    this.reload();

    this.app = new Koa();
    this.frontRouter = new Router();
    this.backRouter = new Router();

    this.initServer();

    this.loaded = false;
    this.started = false;

    const emitCache = [];
    const arrayEvents = {};
    this.events = new events();
    const { emit, once } = this.events;
    const emitArrayEventsIfNeed = (_event, { event, target }, ...args) => {
      _.forIn(arrayEvents, (values, key) => {
        if (values.indexOf(_event) >= 0) {
          let foundAll = true;
          _.forEach(values, (value) => {
            if (value !== _event && emitCache.indexOf(value) < 0) {
              foundAll = false;
              return false;
            }
          });
          if (foundAll) {
            emit.call(this.events, key, { event, target }, ...args);
          }
        }
      });
    };
    this.events.once = (event, ...args) => {
      if (_.isArray(event)) {
        const id = uuid.v4();
        arrayEvents[id] = event;
        once.call(this.events, id, ...args);
      } else {
        once.call(this.events, event, ...args);
      }
    };
    this.events.emit = (event, target = null, ...args) => {
      emit.call(this.events, 'all', { event, target }, ...args);
      emit.call(this.events, event, { event, target }, ...args);
      emitArrayEventsIfNeed(event, { event, target }, ...args);
      if (emitCache.indexOf(event) < 0) emitCache.push(event);
      if (target) {
        emit.call(this.events, `${target}:${event}`, { event, target }, ...args);
        emitArrayEventsIfNeed(`${target}:${event}`, { event, target }, ...args);
        if (emitCache.indexOf(`${target}:${event}`) < 0) emitCache.push(`${target}:${event}`);
      }
    };

    this.events.on('all', ({ event, target }) => {
      const now = new Date();
      let eventName = event.toLocaleLowerCase();
      if (eventName.includes('will')) {
        timers.set(eventName.replace('will', ''), now);
        this.log.silly(chalk`{green ${target}} emitted {magenta ${event}}`);
      } else if (eventName.includes('did')) {
        eventName = eventName.replace('did', '');
        const started = timers.get(eventName) || now;
        const time = new Date(now - started);

        const minutes = time.getMinutes();
        const seconds = time.getSeconds();
        const milliseconds = time.getMilliseconds();
        const timeString = `${
          (minutes ? `${minutes}min ` : '') + (seconds ? `${seconds}s ` : '')
        }${milliseconds}ms`;

        timers.delete(eventName);
        this.log.debug(chalk`{green ${target}} emitted {magenta ${event}} {gray ${timeString}}`);
      }
    });
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
    this.events.emit('willSetMiddlewares', 'leemons');
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
    this.events.emit('didSetMiddlewares', 'leemons');
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
        ctx.body = { status: 401, message: 'Authorization required' };
        return undefined;
      } catch (err) {
        if (_.isObject(authenticated) && authenticated.nextWithoutSession) {
          ctx.state.userSession = null;
          return next();
        }
        ctx.status = 401;
        ctx.body = { status: 401, message: 'Authorization required' };
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
        const rAllowedPermissions = [];
        _.forIn(allowedPermissions, ({ actions }, permissionName) => {
          rAllowedPermissions.push({ permissionName, actions });
        });
        ctx.status = 401;
        ctx.body = {
          status: 401,
          message: 'You do not have permissions',
          allowedPermissions: rAllowedPermissions,
        };
        return undefined;
      } catch (err) {
        console.error(err);
      }
    };
  }

  /**
   * Initializes the api endpoints
   * @param {{
   *  controllers: {[name]: any}[],
   *  routes: {
   *    path: string,
   *    method: string,
   *    handler: string,
   *    authenticated?: boolean,
   *    allowedPermissions?: []}[]}} plugins
   */
  setRoutes(plugins) {
    this.events.emit('willSetRoutes', 'leemons');
    // TODO: Remove server reload endpoint
    this.backRouter.get('/api/reload', (ctx) => {
      ctx.body = { reloading: true };
      this.reload();
    });

    plugins.forEach((plugin) => {
      if (_.isArray(plugin.routes)) {
        plugin.routes.forEach((route) => {
          if (route.handler && route.path && route.method) {
            if (_.get(plugin.controllers, route.handler)) {
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
            } else {
              this.log.error(
                `Not found handler function for the API url: ${route.method.toLocaleLowerCase()} - /api/${
                  plugin.name
                }${route.path}`
              );
            }
          }
        });
      }
    });

    this.backRouter.all(/\/.*/, (ctx) => {
      ctx.status = 404;
      ctx.body = { status: 404, message: 'Url not found' };
    });

    this.events.emit('didSetRoutes', 'leemons');
  }

  // Initialize the frontend handler
  setFrontRoutes() {
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

  async loadBack() {
    /*
     * Create a DatabaseManager for managing the database connections and models
     */
    this.db = createDatabaseManager(this);
    /*
     * Initialize database connections
     */
    await this.db.init();

    /**
     * Load core models
     */
    loadCoreModels(this);
    await this.db.loadModels(_.omit(this.models, 'core_store'));

    this.events.emit('appWillLoadBack', 'leemons');

    const plugins = await loadExternalFiles(this, 'plugins', 'plugin', {
      getProvider: 'enabledProviders',
    });
    const providers = await loadExternalFiles(this, 'providers', 'provider', {
      getPlugin: 'enabledPlugins',
    });

    this.setMiddlewares();
    this.setRoutes([
      ...plugins.filter((plugin) => plugin.status.code === PLUGIN_STATUS.enabled.code),
      ...providers.filter((provider) => provider.status.code === PLUGIN_STATUS.enabled.code),
    ]);

    this.events.emit('appDidLoadBack', 'leemons');

    return { plugins, providers };
  }

  async loadFront(plugins, providers) {
    try {
      this.events.emit('appWillLoadFront', 'leemons');
      await loadFront(this, plugins, providers);

      // If no successful build, do not continue loading front
      if (!(await buildFront())) {
        return;
      }

      // When next is prepared
      leemons.events.emit('frontWillStartServer', 'leemons');
      const prepareFront = ora('Starting frontend server').start();
      // Start production next app
      const start = execa.command(
        `yarn --cwd ${leemons.dir.next} ${
          process.env.NODE_ENV !== 'development' ? 'start' : 'dev'
        }`,
        {
          ...process.env,
          FORCE_COLOR: true,
        }
      );
      // Log the stdout and stderr
      start.stdout
        .pipe(
          nextTransform('ready', async () => {
            prepareFront.succeed('Frontend server started');
            leemons.events.emit('frontDidStartServer', 'leemons');
            this.setFrontRoutes();
            this.events.emit('appDidLoadFront', 'leemons');
          })
        )
        .pipe(frontLogger('info'));
      start.stderr
        .pipe(
          nextTransform('error Command failed', () => {
            prepareFront.fail('Frontend server failed to start');
            leemons.events.emit('frontDidCrash', 'leemons');
          })
        )
        .pipe(frontLogger('error'));
    } catch (e) {
      console.error(e);
    }
  }

  async loadAppConfig() {
    leemons.events.emit('appWillLoadConfig', 'leemons');
    this.config = (await loadConfiguration(this)).configProvider;
    leemons.events.emit('appDidLoadConfig', 'leemons');

    if (this.config.get('config.insecure', false)) {
      this.log.warn(
        'The app is running in insecure mode, this means all the plugins can require any file in your computer'
      );
    }

    return this.config;
  }

  // Load all apps
  async load() {
    if (this.loaded) {
      return true;
    }

    this.events.emit('appWillLoad', 'leemons');

    await this.loadAppConfig();

    /*
     * Load all the backend plugins, database and
     * setup the middlewares
     */
    const { plugins, providers } = await this.loadBack();

    this.enabledPlugins = plugins.filter(
      (plugin) => plugin.status.code === PLUGIN_STATUS.enabled.code
    );
    this.enabledProviders = providers.filter(
      (provider) => provider.status.code === PLUGIN_STATUS.enabled.code
    );
    /*
     * Load all the frontend plugins, build the app if needed
     * and set the middlewares.
     */
    await this.loadFront(this.enabledPlugins, this.enabledProviders);

    this.loaded = true;
    this.events.emit('appDidLoad', 'leemons');

    return true;
  }

  // Start the app
  async start() {
    if (this.started) {
      return;
    }
    this.events.emit('appWillStart', 'leemons');

    await this.load();

    this.server.listen(process.env.PORT, () => {
      this.events.emit('appDidStart', 'leemons');
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
