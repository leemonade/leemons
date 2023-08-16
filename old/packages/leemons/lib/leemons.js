const http = require('http');
const Koa = require('koa');
const Router = require('koa-router');
const Static = require('koa-static');
const cors = require('@koa/cors');
const request = require('request');
const events = require('events-async');
const execa = require('execa');
const _ = require('lodash');
const chalk = require('chalk');
const ora = require('ora');
const uuid = require('uuid');
const withTelemetry = require('leemons-telemetry/withTelemetry');
const koaBody = require('koa-body')({ multipart: true });
const fetch = require('node-fetch');

const leemonsUtils = require('leemons-utils');
const { createDatabaseManager } = require('leemons-database');
const CacheManager = require('leemons-cache/lib');

const { loadConfiguration } = require('./core/config/loadConfig');
const { loadCoreModels } = require('./core/model/loadModel');
const buildFront = require('./core/front/build');
const loadFront = require('./core/plugins/front/loadFront');
const { loadExternalFiles } = require('./core/plugins/loadExternalFiles');
const { PLUGIN_STATUS } = require('./core/plugins/pluginsStatus');
const { nextTransform, frontLogger } = require('./core/front/streams');
const { LeemonsSocket } = require('./socket.io');

class Leemons {
  constructor(log) {
    // expose leemons globally
    global.leemons = this;
    // expose logging system to leemons
    this.log = log;

    this.canReloadFrontend = true;
    this.canReloadBackend = true;

    log.verbose('New leemons');

    // Initialize the reload method (generate a "state" for it)
    this.reload();

    this.app = new Koa();
    this.frontRouter = new Router();
    this.backRouter = new Router();

    this.setEvents();

    this.initServer();

    this.loaded = false;
    this.started = false;
  }

  setEvents() {
    const timers = new Map();

    const emitCache = [];
    const arrayEvents = {};
    // eslint-disable-next-line new-cap
    this.events = new events();

    // TODO: Find best value for listeners in order to memory comsuption
    this.events.setMaxListeners(100);

    const { emit, once } = this.events;
    const emitArrayEventsIfNeed = async (_event, { event, target }, ...args) => {
      const promises = [];
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
            promises.push(emit.call(this.events, key, { event, target }, ...args));
          }
        }
      });
      await Promise.all(promises);
    };
    this.events.once = (event, ...args) => {
      if (_.isArray(event)) {
        const id = uuid.v4();
        arrayEvents[id] = event;
        once.call(this.events, id, ...args);
      }
      once.call(this.events, event, ...args);
    };
    this.events.emit = async (event, target = null, ...args) => {
      if (emitCache.indexOf(event) < 0) emitCache.push(event);
      if (target && emitCache.indexOf(`${target}:${event}`) < 0)
        emitCache.push(`${target}:${event}`);
      await emit.call(this.events, 'all', { event, target }, ...args);
      await emit.call(this.events, event, { event, target }, ...args);
      await emitArrayEventsIfNeed(event, { event, target }, ...args);
      if (target) {
        await emit.call(this.events, `${target}:${event}`, { event, target }, ...args);
        await emitArrayEventsIfNeed(`${target}:${event}`, { event, target }, ...args);
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
      } else {
        this.log.debug(chalk`{red ${target}} emitted {magenta ${event}}`);
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
    // Enable global cors
    if (process.env.CORS) {
      leemons.log.debug('CORS ENABLED: Allowing all incoming traffic');

      const options = {
        origin: '*',
      };

      this.app.use(cors(options));
    }

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
      ctx._id = uuid.v4();

      this.log.http(
        chalk`Start connection to {magenta ${ctx.method}} {green ${ctx.path}} from {yellow ${ctx.ip}}`,
        {
          id: ctx._id,
          ip: ctx.ip,
          url: ctx.path,
          method: ctx.method,
        }
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
          }} {gray ${end - start} ms}`,
          {
            id: ctx._id,
            ip: ctx.ip,
            url: ctx.path,
            method: ctx.method,
            path: ctx._path,
            duration: end - start,
          }
        );
      } catch (err) {
        console.error(err);
        leemons.log.error(err.message);
        leemonsUtils.returnError(ctx, err);
      }
    });

    // this.backRouter.use(bodyParser({ multipart: true }));
    this.backRouter.use(koaBody);

    this.events.emit('didSetMiddlewares', 'leemons');
  }

  authenticatedMiddleware(authenticated) {
    return async (ctx, next) => {
      try {
        let { authorization } = ctx.headers;

        if (!authorization) authorization = ctx.request.query.authorization;

        try {
          authorization = JSON.parse(authorization);
        } catch (e) {}

        ctx.state.authorization = authorization;

        if (_.isString(authorization)) {
          const user = await this.plugins.users.services.users.detailForJWT(authorization);
          if (user) {
            ctx.state.userSession = user;
            return next();
          }
        } else {
          authorization = _.compact(authorization);
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
        console.error(err);
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
        if (!ctx.state.userSession) {
          ctx.status = 401;
          ctx.body = {
            status: 401,
            message:
              'No user session found for check permissions, check if endpoint have [authenticated: true] property',
          };
          return undefined;
        }
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
      return undefined;
    };
  }

  userAgentDatasetMiddleware() {
    return async (ctx, next) => {
      try {
        const isGood = await this.plugins.users.services.users.userSessionCheckUserAgentDatasets(
          ctx.state.userSession
        );

        if (!isGood) {
          const isSocketIo = (this.env.MQTT_PLUGIN || 'mqtt-socket-io') === 'mqtt-socket-io';

          if (isSocketIo) {
            LeemonsSocket.worker.emit(ctx.state.userSession.id, 'USER_AGENT_NEED_UPDATE_DATASET');
          } else {
            this.plugins[this.env.MQTT_PLUGIN || 'mqtt-socket-io'].services.socket.worker.emit(
              ctx.state.userSession.id,
              'USER_AGENT_NEED_UPDATE_DATASET'
            );
          }
        }
        return next();
      } catch (err) {
        console.error(err);
      }
      return undefined;
    };
  }

  xapiMiddleware({ actor, verb, object, context }, pluginName) {
    return async (ctx, next) => {
      await next();
      try {
        // ES: Comprobamos si las propiedades hacen referencia al request
        // EN: Check if the properties reference the request
        if (!_.isEmpty(actor) && actor.indexOf('request.') === 0) {
          // eslint-disable-next-line no-param-reassign
          actor = _.get(ctx, actor);
        }

        if (!_.isEmpty(verb) && verb.indexOf('request.') === 0) {
          // eslint-disable-next-line no-param-reassign
          verb = _.get(ctx, verb);
        }

        if (!_.isEmpty(object) && object.indexOf('request.') === 0) {
          // eslint-disable-next-line no-param-reassign
          object = _.get(ctx, object);
        }

        if (!_.isEmpty(context) && context.indexOf('request.') === 0) {
          // eslint-disable-next-line no-param-reassign
          context = _.get(ctx, context);
        }

        const { userSession } = ctx.state;
        if (this.plugins.xapi) {
          const { services } = this.plugins.xapi;
          await services.statement.add(
            { actor: actor || userSession.id, verb, object, context, pluginName },
            { userSession }
          );
        }
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
    this.backRouter.get('/api/status', (ctx) => {
      ctx.body = { status: 200, message: 'ok' };
      ctx.status = 200;
    });
    this.backRouter.get('/api/reload', (ctx) => {
      ctx.body = { reloading: true };
      this.reload();
    });

    if (process.env.TESTING || process.env.NODE_ENV === 'test' || process.env.testing) {
      this.backRouter.get('/api/database/restore', async (ctx) => {
        try {
          await this.db.reloadDatabase();

          ctx.status = 200;
          ctx.body = {
            status: 200,
            message: 'Database reloaded',
          };
        } catch (e) {
          ctx.status = 500;
          ctx.body = {
            status: 500,
            message: 'Error reloading database',
            details: e.message,
          };
        }
      });
    }

    plugins.forEach((plugin) => {
      if (_.isArray(plugin.routes)) {
        plugin.routes.forEach((route) => {
          if (route.handler && route.path && route.method) {
            if (_.get(plugin.controllers, route.handler)) {
              const handler = _.get(plugin.controllers, route.handler);
              const functions = [];
              if (route.authenticated) {
                functions.push(this.authenticatedMiddleware(route.authenticated));
                if (!route.disableUserAgentDatasetCheck) {
                  functions.push(this.userAgentDatasetMiddleware());
                }
              }

              if (route.allowedPermissions) {
                functions.push(this.permissionsMiddleware(route.allowedPermissions));
              }

              if (!_.isEmpty(route.xapi)) {
                functions.push(this.xapiMiddleware(route.xapi, plugin.name));
              }

              functions.push(async (ctx, next) => {
                ctx._path = route.path;
                await next();
              });

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
    // TODO: Catch error when port 3000 not available
    // React application public path
    this.app.use(Static('./frontend/public'));

    // Make frontend server handle with all non /api requests
    this.frontRouter.get(/(?!^\/api)^\/.*/, async (ctx) => {
      try {
        const frontServer = process.env.FRONT_SERVER || 'http://localhost:3000';
        // EN: Check if the server is ready
        // ES: Comprobamos si el servidor está listo
        await fetch(`${frontServer}${ctx.req.url}`, {
          method: 'HEAD',
        });

        // EN: Redirect to the react server
        // ES: Redirect to the react server
        ctx.req.pipe(request(`${frontServer}${ctx.req.url}`)).pipe(ctx.res);
        // Stop Koa handling the request
      } catch (e) {
        ctx.res.setHeader('Content-Type', 'text/html');
        ctx.res.write(`<html><p>The frontend server is not ready yet</p></html>`);
        ctx.res.end();
      }
      ctx.respond = false;
    });
  }

  query(model, plugin) {
    return this.db.query(model, plugin);
  }

  // TODO: Move to leemons-cache and create leemons-cache-connector-redis
  async initCache() {
    if (!this.cache) {
      const cacheManager = new CacheManager({ leemons: this });
      this.cache = await cacheManager.init();
    }

    return this.cache;
  }

  async loadBack(parent) {
    return withTelemetry('loadBack', parent, async (loadBackTelemetry) => {
      await withTelemetry('initDatabase', loadBackTelemetry, async (t) => {
        this.cache = await this.initCache();

        /*
         * Create a DatabaseManager for managing the database connections and models
         */
        let span = t.startSpan('createDatabaseManager');
        this.db = createDatabaseManager(this);
        if (span) {
          span.end();
        }
        /*
         * Initialize database connections
         */
        span = t.startSpan('initDatabase');
        await this.db.init();
        if (span) {
          span.end();
        }

        /**
         * Load core models
         */
        span = t.startSpan('loadCoreModels');
        loadCoreModels(this);
        await this.db.loadModels(_.omit(this.models, 'core_store'));
        if (span) {
          span.end();
        }
      });

      this.events.emit('appWillLoadBack', 'leemons');

      return withTelemetry('loadPlugins', loadBackTelemetry, async (t) => {
        let span = t.startSpan('loadPlugins');
        const listProviders = (plugin) =>
          Object.values(leemons.providers).filter((provider) =>
            provider?.config?.config?.pluginsCanUseMe.includes(plugin.name)
          ); // provider.config.config.pluginsCanUseMe.includes(plugin.name)}

        const plugins = await loadExternalFiles(this, 'plugins', 'plugin', {
          // Get the given provider from the list of available providers
          getProvider: listProviders,
          // Get the list of available providers, return a function to immediate return
          listProviders: (plugin) => (securePlugin) => listProviders(plugin).map(securePlugin),
        });
        if (span) {
          await span.end();
        }
        span = t.startSpan('loadProviders');
        const providers = await loadExternalFiles(this, 'providers', 'provider', {
          getPlugin: () => Object.values(leemons.plugins),
        });

        if (span) {
          span.end();
        }

        span = t.startSpan('setRouter');
        this.setMiddlewares();
        this.setRoutes([
          ...plugins.filter((plugin) => plugin.status.code === PLUGIN_STATUS.enabled.code),
          ...providers.filter((provider) => provider.status.code === PLUGIN_STATUS.enabled.code),
        ]);
        if (span) {
          span.end();
        }

        // Send the installed plugins to trace loading time
        t.setCustomContext({
          plugins: plugins.map(({ source, name, version, status }) => ({
            source,
            name,
            version,
            status,
          })),
          providers: providers.map(({ source, name, version, status }) => ({
            source,
            name,
            version,
            status,
          })),
        });
        this.events.emit('appDidLoadBack', 'leemons');

        return { plugins, providers };
      });
    });
  }

  async loadFront(plugins, providers) {
    try {
      this.events.emit('appWillLoadFront', 'leemons');
      await loadFront(this, plugins, providers);

      // If no successful build, do not continue loading front
      if (!(await buildFront())) {
        return;
      }

      // When frontend is prepared
      leemons.events.emit('frontWillStartServer', 'leemons');
      const prepareFront = ora('Starting frontend server').start();
      // Start production frontend app
      const start = execa.command(
        `yarn --cwd ${leemons.dir.frontend} ${
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
    return withTelemetry('loadAppConfig', async () => {
      leemons.events.emit('appWillLoadConfig', 'leemons');
      const config = await loadConfiguration(this, { useProcessEnv: true });
      this.config = config.configProvider;
      this.env = config.env;
      leemons.events.emit('appDidLoadConfig', 'leemons');

      if (this.config.get('config.insecure', false)) {
        this.log.warn(
          'The app is running in insecure mode, this means all the plugins can require any file in your computer'
        );
      }

      return this.config;
    });
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
    await this.setFrontRoutes();
    // await this.loadFront(this.enabledPlugins, this.enabledProviders);

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

    const isSocketIo = (this.env.MQTT_PLUGIN || 'mqtt-socket-io') === 'mqtt-socket-io';
    if (isSocketIo) {
      LeemonsSocket.worker.init(this.server);
      LeemonsSocket.worker.onConnection((socket) => {
        console.log('Connected to socket.io', socket.session.email);
      });
      LeemonsSocket.worker.use(async (socket, next) => {
        const authenticate = this.authenticatedMiddleware(true);
        const ctx = {
          state: {},
          headers: { authorization: socket.handshake.auth.token },
        };
        const response = await authenticate(ctx, () => true);
        if (response) {
          // eslint-disable-next-line no-param-reassign
          socket.session = ctx.state.userSession;
          next();
        }
      });
    } else {
      this.plugins[this.env.MQTT_PLUGIN || 'mqtt-socket-io'].services.socket.worker.init(
        this.server
      );
    }

    this.server.listen(process.env.PORT, () => {
      this.events.emit('appDidStart', 'leemons');
      this.log.info(`Listening on http://localhost:${process.env.PORT}`);
      if (process.send) {
        process.send('ready');
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
