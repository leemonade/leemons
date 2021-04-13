const http = require('http');
const Koa = require('koa');
const Router = require('koa-router');
const Static = require('koa-static');
const nextjs = require('next');
const execa = require('execa');
const _ = require('lodash');
const ora = require('ora');
const bodyParser = require('koa-bodyparser');

const { createDatabaseManager } = require('leemons-database');
const { loadConfiguration } = require('./core/config/loadConfig');
const { loadModels } = require('./core/model/loadModel');
const { loadPlugins, initializePlugins } = require('./core/plugins/loadPlugins');

class Leemons {
  constructor(log) {
    // expose leemons globally
    global.leemons = this;

    // TODO: Do a good log system
    this.log = log;
    log('New leemons');

    // Initialize the reload method (generate a "state" for it)
    this.reload();

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
    this.app.use(async (ctx, next) => {
      this.log(`New connection to ${ctx.method} ${ctx.path}`);
      await next();
    });

    this.app.use(bodyParser());
  }

  // Initialize the api endpoints
  setRoutes() {
    // Plugins
    Object.entries(this.plugins).forEach(([, plugin]) => {
      if (plugin.routes) {
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

  query(model) {
    return this.db.query(model);
  }

  // Load all apps
  async load() {
    if (this.loaded) {
      return true;
    }
    loadPlugins(this);

    loadModels(this);
    // Create a database manager
    this.db = createDatabaseManager(this);
    // Initialize all database connections
    await this.db.init();

    initializePlugins(this);

    // Initialize next
    this.front = nextjs({
      dir: this.dir.next,
    });

    if (this.needsBuild) {
      const spinner = ora('Building frontend').start();
      await execa('npm', ['run', 'build', '--prefix', this.dir.next]);
      spinner.succeed('Frontend builded');
    }
    this.frontHandler = this.front.getRequestHandler();

    // TODO: this should be on a custom loader
    // When next is prepared
    return this.front.prepare().then(() => {
      this.setMiddlewares();
      this.setRoutes();
      this.setFrontRoutes();
      this.loaded = true;
    });
  }

  // Start the app
  async start() {
    if (this.started) {
      return;
    }
    await this.load();
    this.server.listen(process.env.PORT, () => {
      this.log(`Listening on http://localhost:${process.env.PORT}`);

      process.send('running');
      this.started = true;
    });
  }
}

module.exports = (...args) => {
  const leemons = new Leemons(...args);
  return leemons;
};
