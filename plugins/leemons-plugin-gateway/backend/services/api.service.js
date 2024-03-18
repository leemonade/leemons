const ApiGateway = require('moleculer-web');
const { parse } = require('url');
const { LeemonsDeploymentManagerMixin } = require('@leemons/deployment-manager');
const restActions = require('./rest/api.rest');

// async function dumpCollections(database) {
//   // Obtener todas las colecciones
//   const collections = await database.listCollections().toArray();

//   const dump = {};

//   const promises = collections.map(async (collection) => {
//     const documents = await mongoose.connection.collection(collection.name).find({}).toArray();
//     dump[collection.name] = documents;
//   });
//   await Promise.all(promises);

//   // Escribir el dump en un archivo JSON
//   await fs.writeFileSync('./dump.json', JSON.stringify(dump, null, 2));
// }

/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 * @typedef {import('http').IncomingMessage} IncomingRequest Incoming HTTP Request
 * @typedef {import('http').ServerResponse} ServerResponse HTTP Server Response
 * @typedef {import('moleculer-web').ApiSettingsSchema} ApiSettingsSchema API Setting Schema
 */
// ad
module.exports = {
  name: 'gateway',
  mixins: [
    ApiGateway,
    LeemonsDeploymentManagerMixin({
      checkIfCanCallMe: false,
      getDeploymentIdInCall: true,
      dontGetDeploymentIDOnActionCall: [
        'deployment-manager.reloadAllDeploymentsRest',
        'deployment-manager.addManualDeploymentRest',
        'gateway.dropDBRest',
        'gateway.statusRest',
        'v1.client-manager.protected.newFreemiumClient',
        'v1.client-manager.protected.isSubdomainInUse',
      ],
    }),
  ],

  actions: {
    ...restActions,
  },

  /** @type {ApiSettingsSchema} More info about settings: https://moleculer.services/docs/0.14/moleculer-web.html */
  settings: {
    cors: {
      origin: '*',
    },
    // Exposed port
    port: process.env.PORT || 3000,

    // Exposed IP
    ip: '0.0.0.0',

    // Global Express middlewares. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Middlewares
    use: [],

    routes: [
      {
        path: '/',
        whitelist: ['**'],
        use: [],
        mergeParams: true,
        authentication: false,
        authorization: false,
      },
      {
        path: '/api',

        whitelist: ['**'],

        // Route-level Express middlewares. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Middlewares
        use: [],

        // Enable/disable parameter merging method. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Disable-merging
        mergeParams: true,

        // Enable authentication. Implement the logic into `authenticate` method. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Authentication
        authentication: true,

        // Enable authorization. Implement the logic into `authorize` method. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Authorization
        authorization: false,

        // The auto-alias feature allows you to declare your route alias directly in your services.
        // The gateway will dynamically build the full routes from service schema.
        autoAliases: true,

        aliases: {
          // -- Gateway (Finish) --
          'POST database/drop': 'gateway.dropDBRest',
        },

        /**
         * Before call hook. You can check the request.
         * @param {Context} ctx
         * @param {Object} route
         * @param {IncomingRequest} req
         * @param {ServerResponse} res
         * @param {Object} data
         *
         onBeforeCall(ctx, route, req, res) {
         // Set request headers to context meta
         ctx.meta.userAgent = req.headers["user-agent"];
         }, */

        /**
         * After call hook. You can modify the data.
         * @param {Context} ctx
         * @param {Object} route
         * @param {IncomingRequest} req
         * @param {ServerResponse} res
         * @param {Object} data
         onAfterCall(ctx, route, req, res, data) {
         // Async function which return with Promise
         return doSomething(ctx, res, data);
         }, */

        onBeforeCall(ctx, route, req) {
          ctx.meta.clientIP =
            req.headers['x-forwarded-for'] ||
            req.connection.remoteAddress ||
            req.socket.remoteAddress ||
            req.connection.socket.remoteAddress;
          const url = req.headers.referer || req.headers.referrer || req.headers.host;
          if (url.startsWith('localhost') && req.headers.apikey !== process.env.MANUAL_PASSWORD) {
            ctx.meta.hostname = 'localhost';
          } else if (ctx.meta) {
            if (
              process.env.MANUAL_PASSWORD &&
              req.headers.apikey === process.env.MANUAL_PASSWORD &&
              req.headers.customdomain
            ) {
              ctx.meta.hostname = req.headers.customdomain;
            } else {
              const parseResult = parse(url);
              ctx.meta.hostname =
                parseResult?.hostname ||
                parseResult?.host ||
                parseResult?.pathname ||
                parseResult?.path;
            }
          }
        },

        onError(req, res, err) {
          let response = { ...err, message: err.message };
          if (err.data) {
            response = { ...response, ...err.data };
          }
          res.setHeader('Content-Type', 'application/json');
          res.writeHead(err.httpStatusCode || err.code || 500);
          res.end(JSON.stringify(response));
        },

        // Calling options. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Calling-options
        callingOptions: {},

        bodyParsers: {
          json: {
            strict: false,
            limit: '1MB',
          },
          urlencoded: {
            extended: true,
            limit: '1MB',
          },
        },

        // Mapping policy setting. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Mapping-policy
        mappingPolicy: 'all', // Available values: "all", "restrict"

        // Enable/disable logging
        logging: true,
      },
    ],

    // Do not log client side errors (does not log an error response when the error.code is 400<=X<500)
    log4XXResponses: true,
    // Logging the request parameters. Set to any log level to enable it. E.g. "info"
    logRequestParams: null,
    // Logging the response data. Set to any log level to enable it. E.g. "info"
    logResponseData: null,

    // Serve assets from "public" folder. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Serve-static-files
    assets: {
      folder: 'public',

      // Options to `server-static` module
      options: {},
    },
  },

  methods: {
    /**
     * Authenticate the request. It check the `Authorization` token value in the request header.
     * Check the token value & resolve the user by the token.
     * The resolved user will be available in `ctx.meta.user`
     *
     * PLEASE NOTE, IT'S JUST AN EXAMPLE IMPLEMENTATION. DO NOT USE IN PRODUCTION!
     *
     * @param {Context} ctx
     * @param {Object} route
     * @param {IncomingRequest} req
     * @returns {Promise}
     */
    async authenticate(ctx, route, req) {
      let { authorization } = req.headers;
      if (!authorization) authorization = req.query.authorization;
      if (authorization) {
        try {
          authorization = JSON.parse(authorization);
        } catch (e) {
          // Nothing
        }
      }
      ctx.meta.authorization = authorization;
    },

    /**
     * Authorize the request. Check that the authenticated user has right to access the resource.
     *
     * PLEASE NOTE, IT'S JUST AN EXAMPLE IMPLEMENTATION. DO NOT USE IN PRODUCTION!
     *
     * @param {Context} ctx
     * @param {Object} route
     * @param {IncomingRequest} req
     * @returns {Promise}
     */
    async authorize(ctx, route, req) {
      // Get the authenticated user.
      const { user } = ctx.meta;

      // It check the `auth` property in action schema.
      if (req.$action.auth == 'required' && !user) {
        throw new ApiGateway.Errors.UnAuthorizedError('NO_RIGHTS');
      }
    },
  },
};
