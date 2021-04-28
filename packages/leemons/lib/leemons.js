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
const { loadPlugins, initializePlugins } = require('./core/plugins/loadPlugins');
const buildFront = require('./core/front/build');

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

    // TODO: Stop exposing the server and router
    this.app = new Koa();
    this.router = new Router();

    this.config = loadConfiguration(this);

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
    this.app.use(bodyParser());
    this.app.use(async (ctx, next) => {
      this.log.http(
        chalk`New connection to {magenta ${ctx.method}} {green ${ctx.path}} from {yellow ${ctx.ip}}`
      );
      await next();
    });
  }

  // Initialize the api endpoints
  setRoutes() {
    // Plugins
    this.router.get('/api/reload', (ctx) => {
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
            this.router[route.method.toLocaleLowerCase()](
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
    this.router.get(/(?!^\/api)^\/.*/, async (ctx) => {
      await this.frontHandler(ctx.req, ctx.res);
      // Stop Koa handling the request
      ctx.respond = false;
    });

    // Expose all routes to koa
    this.app.use(this.router.routes()).use(this.router.allowedMethods());
  }

  query(model, plugin) {
    return this.db.query(model, plugin);
  }

  // Load all apps
  async load() {
    await hooks.fireEvent('leemons::load', { status: 'start' });
    if (this.loaded) {
      return true;
    }

    loadPlugins(this);

    loadModels(this);
    // Create a database manager
    this.db = createDatabaseManager(this);

    // Initialize all database connections
    await hooks.fireEvent('leemons::initDB', { status: 'start' });
    await this.db.init();
    await hooks.fireEvent('leemons::initDB', { status: 'end' });

    await hooks.fireEvent('leemons::initializePlugins', { status: 'start' });
    initializePlugins(this);
    await hooks.fireEvent('leemons::initializePlugins', { status: 'end' });

    // Initialize next
    this.front = nextjs({
      dir: this.dir.next,
    });

    await hooks.fireEvent('leemons::buildFront', { status: 'start' });
    await buildFront();
    await hooks.fireEvent('leemons::buildFront', { status: 'end' });
    this.frontHandler = this.front.getRequestHandler();

    // TODO: this should be on a custom loader
    // When next is prepared
    await hooks.fireEvent('leemons::prepareFrontend', { status: 'start' });
    const prepareFront = ora('Starting frontend server').start();
    return this.front
      .prepare()
      .then(async () => {
        prepareFront.succeed('Frontend server started');
        await hooks.fireEvent('leemons::prepareFrontend', { status: 'end' });
        this.setMiddlewares();
        this.setRoutes();
        this.setFrontRoutes();
      })
      .then(async () => {
        this.loaded = true;
        await hooks.fireEvent('leemons::load', { status: 'end' });
      });
  }

  // Start the app
  async start() {
    if (this.started) {
      return;
    }
    await this.load();
    this.server.listen(process.env.PORT, () => {
      this.log.debug(`Listening on http://localhost:${process.env.PORT}`);

      process.send('running');
      this.started = true;
    });
  }
}

module.exports = (...args) => {
  const leemons = new Leemons(...args);
  return leemons;
};
