/* eslint-disable no-await-in-loop */
/* eslint-disable prefer-template */
/* eslint-disable no-param-reassign */
/* eslint-disable sonarjs/cognitive-complexity */
/* eslint-disable no-restricted-syntax */
/* eslint-disable guard-for-in */
/* eslint-disable no-continue */
const swaggerUiAssetPath = require('swagger-ui-dist').getAbsoluteFSPath();
const fs = require('fs');
const convert = require('@openapi-contrib/json-schema-to-openapi-schema').default;

const UNRESOLVED_ACTION_NAME = 'unknown-action';

const NODE_TYPES = {
  boolean: 'boolean',
  number: 'number',
  date: 'date',
  uuid: 'uuid',
  email: 'email',
  url: 'url',
  string: 'string',
  enum: 'enum',
};

/*
 * Inspired by https://github.com/icebob/kantab/blob/fd8cfe38d0e159937f4e3f2f5857c111cadedf44/backend/mixins/openapi.mixin.js
 */
module.exports = {
  name: `openapi`,
  settings: {
    port: process.env.PORT || 3000,
    onlyLocal: false, // build schema from only local services
    schemaPath: '/api/openapi/openapi.json',
    uiPath: '/api/openapi/ui',
    // set //unpkg.com/swagger-ui-dist@3.38.0 for fetch assets from unpkg
    assetsPath: '/api/openapi/assets',
    // names of moleculer-web services which contains urls, by default - all
    collectOnlyFromWebServices: [],
    requestBodyAndResponseBodyAreSameOnMethods: [
      /* 'post',
      'patch',
      'put', */
    ],
    requestBodyAndResponseBodyAreSameDescription:
      'The answer may vary slightly from what is indicated here. Contain id and/or other additional attributes.',
    openapi: {
      openapi: '3.0.3',
      info: {
        description: '',
        version: '0.0.0',
        title: 'Api docs',
      },
      tags: [],
      paths: {},
      security: [
        {
          JWTToken: [],
        },
      ],
      components: {
        schemas: {
          // Standart moleculer schemas
          DbMixinList: {
            type: 'object',
            properties: {
              rows: {
                type: 'array',
                items: {
                  type: 'object',
                },
              },
              totalCount: {
                type: 'number',
              },
            },
          },
          DbMixinFindList: {
            type: 'array',
            items: {
              type: 'object',
            },
          },
          Item: {
            type: 'object',
          },
        },
        securitySchemes: {
          JWTToken: {
            type: 'apiKey',
            in: 'header',
            name: 'authorization',
          },
        },
        responses: {
          // Standart moleculer responses
          ServerError: {
            description: 'Server errors: 500, 501, 400, 404 and etc...',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  example: {
                    name: 'MoleculerClientError',
                    message: 'Server error message',
                    code: 500,
                  },
                },
              },
            },
          },
          UnauthorizedError: {
            description: 'Need auth',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  example: {
                    pluginName: 'leebrary',
                    pluginVersion: 1,
                    httpStatusCode: 401,
                    message: '[LeemonsMiddlewareAuthenticated] No authorization header',
                  },
                },
              },
            },
          },
          ValidationError: {
            description: 'Fields invalid',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    code: {
                      type: 'integer',
                      example: 422,
                    },
                    type: {
                      type: 'string',
                      example: 'VALIDATION_ERROR',
                    },
                    data: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          instancePath: {
                            type: 'string',
                            example: '',
                          },
                          schemaPath: {
                            type: 'string',
                            example: '#/required',
                          },
                          keyword: {
                            type: 'string',
                            example: 'required',
                          },
                          params: {
                            type: 'object',
                            properties: {
                              missingProperty: {
                                type: 'string',
                                example: 'name',
                              },
                            },
                          },
                          message: {
                            type: 'string',
                            example: "must have required property 'name'",
                          },
                        },
                      },
                    },
                    retryable: {
                      type: 'boolean',
                      example: false,
                    },
                    message: {
                      type: 'string',
                      example: 'Parameters validation error!',
                    },
                  },
                },
              },
            },
          },
          ReturnedData: {
            description: '',
            content: {
              'application/json': {
                schema: {
                  oneOf: [
                    {
                      $ref: '#/components/schemas/DbMixinList',
                    },
                    {
                      $ref: '#/components/schemas/DbMixinFindList',
                    },
                    {
                      $ref: '#/components/schemas/Item',
                    },
                  ],
                },
              },
            },
          },
          FileNotExist: {
            description: 'File not exist',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  example: {
                    name: 'MoleculerClientError',
                    message: 'File missing in the request',
                    code: 400,
                  },
                },
              },
            },
          },
          FileTooBig: {
            description: 'File too big',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  example: {
                    name: 'PayloadTooLarge',
                    message: 'Payload too large',
                    code: 413,
                    type: 'PAYLOAD_TOO_LARGE',
                    data: {
                      fieldname: 'file',
                      filename: '4b2005c0b8.png',
                      encoding: '7bit',
                      mimetype: 'image/png',
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  actions: {
    generateDocs: {
      openapi: {
        // you can declare custom Path Item Object
        // which override autogenerated object from params
        // https://github.com/OAI/OpenAPI-Specification/blob/b748a884fa4571ffb6dd6ed9a4d20e38e41a878c/versions/3.0.3.md#path-item-object-example
        summary: 'OpenAPI schema url',

        // you custom response
        // https://github.com/OAI/OpenAPI-Specification/blob/b748a884fa4571ffb6dd6ed9a4d20e38e41a878c/versions/3.0.3.md#response-object-examples
        responses: {
          200: {
            description: '',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/OpenAPIModel',
                },
              },
            },
          },
        },

        // you custom tag
        // https://github.com/OAI/OpenAPI-Specification/blob/b748a884fa4571ffb6dd6ed9a4d20e38e41a878c/versions/3.0.3.md#fixed-fields-8
        tags: ['openapi'],

        // components which attached to root of docx
        // https://github.com/OAI/OpenAPI-Specification/blob/b748a884fa4571ffb6dd6ed9a4d20e38e41a878c/versions/3.0.3.md#components-object
        components: {
          schemas: {
            // you custom schema
            // https://github.com/OAI/OpenAPI-Specification/blob/b748a884fa4571ffb6dd6ed9a4d20e38e41a878c/versions/3.0.3.md#models-with-polymorphism-support
            OpenAPIModel: {
              type: 'object',
              properties: {
                openapi: {
                  example: '3.0.3',
                  type: 'string',
                  description: 'OpenAPI version',
                },
                info: {
                  type: 'object',
                  properties: {
                    description: {
                      type: 'string',
                    },
                  },
                },
                tags: {
                  type: 'array',
                  items: {
                    type: 'string',
                  },
                },
              },
              required: ['openapi'],
            },
          },
        },
      },
      handler() {
        return this.generateSchema();
      },
    },
    assets: {
      openapi: {
        summary: 'OpenAPI assets',
        description: 'Return files from swagger-ui-dist folder',
      },
      params: {
        file: {
          type: 'enum',
          values: [
            `swagger-ui.css`,
            `swagger-ui.css.map`,
            `swagger-ui-bundle.js`,
            `swagger-ui-bundle.js.map`,
            `swagger-ui-standalone-preset.js`,
            `swagger-ui-standalone-preset.js.map`,
          ],
        },
      },
      handler(ctx) {
        if (ctx.params.file.indexOf('.css') > -1) {
          ctx.meta.$responseType = 'text/css';
        } else if (ctx.params.file.indexOf('.js') > -1) {
          ctx.meta.$responseType = 'text/javascript';
        } else {
          ctx.meta.$responseType = 'application/octet-stream';
        }

        return fs.createReadStream(`${swaggerUiAssetPath}/${ctx.params.file}`);
      },
    },
    ui: {
      openapi: {
        summary: 'OpenAPI ui',
        description: 'You can provide any schema file in query param',
      },
      params: {
        url: { $$t: 'Schema url', type: 'string', optional: true },
      },
      handler(ctx) {
        ctx.meta.$responseType = 'text/html; charset=utf-8';

        return `
      <html>
        <head>
           <title>OpenAPI UI</title>
           <link rel="stylesheet" href="${this.settings.assetsPath}/swagger-ui.css"/>
        </head>
        <body>

          <div id="swagger-ui">
            <p>Loading...</p>
            <noscript>If you see json, you need to update your moleculer-web to 0.8.0 and moleculer to 0.12</noscript>
          </div>

          <script src="${this.settings.assetsPath}/swagger-ui-bundle.js"></script>
          <script src="${this.settings.assetsPath}/swagger-ui-standalone-preset.js"></script>
          <script>
            window.onload = function() {
             SwaggerUIBundle({
               url: "${ctx.params.url || this.settings.schemaPath}",
               dom_id: '#swagger-ui',
               deepLinking: true,
               presets: [
                 SwaggerUIBundle.presets.apis,
                 SwaggerUIStandalonePreset,
               ],
               plugins: [
                 SwaggerUIBundle.plugins.DownloadUrl
               ],
               layout: "StandaloneLayout",
             });
            }
          </script>

        </body>
      </html>`;
      },
    },
  },
  methods: {
    commonPathItemObjectResponses(params) {
      const defaultResponses = {
        200: {
          $ref: '#/components/responses/ReturnedData',
        },
        401: {
          $ref: '#/components/responses/UnauthorizedError',
        },
        // 422: {
        //   $ref: '#/components/responses/ValidationError',
        // },
        default: {
          $ref: '#/components/responses/ServerError',
        },
      };

      if (params && Object.keys(params).length) {
        defaultResponses[422] = {
          $ref: '#/components/responses/ValidationError',
        };
      }
      return defaultResponses;
    },
    fetchServicesWithActions() {
      return this.broker.call('$node.services', {
        withActions: true,
        onlyLocal: this.settings.onlyLocal,
      });
    },
    fetchAliasesForService(service) {
      return this.broker.call(`${service}.listAliases`);
    },
    async generateSchema() {
      const doc = JSON.parse(JSON.stringify(this.settings.openapi));

      const nodes = await this.fetchServicesWithActions();

      const routes = await this.collectRoutes(nodes);

      await this.attachParamsAndOpenapiFromEveryActionToRoutes(routes, nodes);

      this.attachRoutesToDoc(routes, doc);

      return doc;
    },
    async attachParamsAndOpenapiFromEveryActionToRoutes(routes, nodes) {
      for (const routeAction in routes) {
        for (const node of nodes) {
          for (const nodeAction in node.actions) {
            if (routeAction === nodeAction) {
              const actionProps = node.actions[nodeAction];
              // actionProps.params === null means that the action has no params
              // actionsProps.params = {} means than the action params has to be documented
              routes[routeAction].params = await convert(actionProps.params || {});
              routes[routeAction].openapi = actionProps.openapi || null;
              break;
            }
          }
        }
      }
    },
    async collectRoutes(nodes) {
      const routes = {};

      for (const node of nodes) {
        // find routes in web-api service
        if (node.settings && node.settings.routes) {
          if (
            this.settings.collectOnlyFromWebServices &&
            this.settings.collectOnlyFromWebServices.length > 0 &&
            !this.settings.collectOnlyFromWebServices.includes(node.name)
          ) {
            continue;
          }

          // iterate each route
          for (const route of node.settings.routes) {
            // map standart aliases
            this.buildActionRouteStructFromAliases(route, routes);
          }

          let service = node.name;
          // resolve paths with auto aliases
          const hasAutoAliases = node.settings.routes.some((route) => route.autoAliases);
          if (hasAutoAliases) {
            // suport services that has version, like v1.api
            if (
              Object.prototype.hasOwnProperty.call(node, 'version') &&
              node.version !== undefined
            ) {
              service = `v${node.version}.` + service;
            }
            const autoAliases = await this.fetchAliasesForService(service);
            const convertedRoute = this.convertAutoAliasesToRoute(autoAliases);
            this.buildActionRouteStructFromAliases(convertedRoute, routes);
          }
        }
      }

      return routes;
    },
    /**
     * @link https://github.com/moleculerjs/moleculer-web/blob/155ccf1d3cb755dafd434e84eb95e35ee324a26d/src/index.js#L229
     * @param autoAliases<Array{Object}>
     * @returns {{path: string, aliases: {}}}
     */
    convertAutoAliasesToRoute(autoAliases) {
      const route = {
        path: '',
        autoAliases: true,
        aliases: {},
      };

      for (const obj of autoAliases) {
        const alias = `${obj.methods} ${obj.fullPath}`;
        route.aliases[alias] = obj.actionName || UNRESOLVED_ACTION_NAME;
      }

      return route;
    },
    /**
     * convert `GET /table`: `table.get`
     * to {action: {
     *   actionType:'multipart|null',
     *   params: {},
     *   autoAliases: true|undefined
     *   paths: [
     *    {base: 'api/uploads', alias: 'GET /table'}
     *   ]
     *   openapi: null
     * }}
     * @param route
     * @param routes
     * @returns {{}}
     */
    buildActionRouteStructFromAliases(route, routes) {
      for (const alias in route.aliases) {
        const aliasInfo = route.aliases[alias];
        let actionType = aliasInfo.type;

        let action = '';
        if (aliasInfo.action) {
          action = aliasInfo.action;
        } else if (Array.isArray(aliasInfo)) {
          action = aliasInfo[aliasInfo.length - 1];
        } else if (typeof aliasInfo !== 'string') {
          action = UNRESOLVED_ACTION_NAME;
        } else {
          action = aliasInfo;
        }
        // support actions like multipart:import.proceedFile
        if (action.includes(':')) {
          [actionType, action] = action.split(':');
        }

        if (!routes[action]) {
          routes[action] = {
            actionType,
            params: {},
            paths: [],
            openapi: null,
          };
        }

        routes[action].paths.push({
          base: route.path || '',
          alias,
          autoAliases: route.autoAliases,
          openapi: aliasInfo.openapi || null,
        });
      }

      return routes;
    },
    attachRoutesToDoc(routes, doc) {
      // route to openapi paths
      for (const action in routes) {
        const { paths, params, actionType, openapi = {} } = routes[action];
        const service = action.split('.').slice(0, -1).join('.');

        this.addTagToDoc(doc, service);

        for (const path of paths) {
          // parse method and path from: POST /api/table
          const [tmpMethod, subPath] = path.alias.split(' ');
          const method = tmpMethod.toLowerCase();

          // convert /:table to /{table}
          const openapiPath = this.formatParamUrl(this.normalizePath(`${path.base}/${subPath}`));

          const [queryParams, addedQueryParams] = this.extractParamsFromUrl(openapiPath);

          if (!doc.paths[openapiPath]) {
            doc.paths[openapiPath] = {};
          }

          if (doc.paths[openapiPath][method]) {
            continue;
          }

          // Path Item Object
          // https://github.com/OAI/OpenAPI-Specification/blob/b748a884fa4571ffb6dd6ed9a4d20e38e41a878c/versions/3.0.3.md#path-item-object-example
          doc.paths[openapiPath][method] = {
            summary: '',
            tags: [service],
            // rawParams: params,
            parameters: [...queryParams],
            responses: {
              // attach common responses
              ...this.commonPathItemObjectResponses(params),
            },
          };

          if (method === 'get' || method === 'delete') {
            doc.paths[openapiPath][method].parameters.push(
              ...this.moleculerParamsToQuery(params, addedQueryParams)
            );
          } else {
            const schemaName = action;
            this.createSchemaFromParams(doc, schemaName, params, addedQueryParams);
            if (params && Object.keys(params).length) {
              doc.paths[openapiPath][method].requestBody = {
                content: {
                  'application/json': {
                    schema: {
                      $ref: `#/components/schemas/${schemaName}`,
                    },
                  },
                },
              };
            }
          }

          if (this.settings.requestBodyAndResponseBodyAreSameOnMethods.includes(method)) {
            doc.paths[openapiPath][method].responses[200] = {
              description: this.settings.requestBodyAndResponseBodyAreSameDescription,
              ...doc.paths[openapiPath][method].requestBody,
            };
          }

          // if multipart/stream convert fo formData/binary
          if (actionType === 'multipart' || actionType === 'stream') {
            doc.paths[openapiPath][method] = {
              ...doc.paths[openapiPath][method],
              parameters: [...queryParams],
              requestBody: this.getFileContentRequestBodyScheme(openapiPath, method, actionType),
            };
          }

          // merge values from action
          doc.paths[openapiPath][method] = this.mergePathItemObjects(
            doc.paths[openapiPath][method],
            openapi
          );

          // merge values which exist in web-api service
          // in routes or custom function
          doc.paths[openapiPath][method] = this.mergePathItemObjects(
            doc.paths[openapiPath][method],
            path.openapi
          );

          // add tags to root of scheme
          if (doc.paths[openapiPath][method].tags) {
            doc.paths[openapiPath][method].tags.forEach((name) => {
              this.addTagToDoc(doc, name);
            });
          }

          // add components to root of scheme
          if (doc.paths[openapiPath][method].components) {
            doc.components = this.mergeObjects(
              doc.components,
              doc.paths[openapiPath][method].components
            );
            delete doc.paths[openapiPath][method].components;
          }

          doc.paths[openapiPath][method].summary = `
            ${doc.paths[openapiPath][method].summary}
            (${action})
            ${path.autoAliases ? '[autoAlias]' : ''}
            ${
              (!openapi || !Object.keys(openapi).length) && !Object.keys(params).length
                ? '(TO BE DOCUMENTED)'
                : ''
            }
          `.trim();
        }
      }
    },
    addTagToDoc(doc, tagName) {
      const exist = doc.tags.some((v) => v.name === tagName);
      if (!exist && tagName) {
        doc.tags.push({
          name: tagName,
        });
      }
    },
    /**
     * Convert moleculer params to openapi query params
     * @param obj
     * @param exclude{Array<string>}
     * @returns {[]}
     */
    moleculerParamsToQuery(obj = {}, exclude = []) {
      const out = [];

      for (const fieldName in obj) {
        // skip system field in validator scheme
        // if (fieldName.startsWith('$$')) {
        //   continue;
        // }
        if (exclude.includes(fieldName)) {
          continue;
        }

        const node = obj[fieldName];

        // array nodes
        if (Array.isArray(node) || (node.type && node.type === 'array')) {
          const item = {
            name: `${fieldName}[]`,
            description: node.description,
            in: 'query',
            schema: node,
            // schema: {
            //   type: 'array',
            //   items: this.getTypeAndExample({
            //     default: node.default ? node.default[0] : undefined,
            //     enum: node.enum,
            //     type: node.items,
            //   }),
            //   unique: node.unique,
            //   minItems: node.length || node.min,
            //   maxItems: node.length || node.max,
            // },
          };
          out.push(item);
          continue;
        }

        out.push({
          in: 'query',
          name: fieldName,
          description: node.description,
          schema: node,
          // schema: this.getTypeAndExample(node),
        });
      }

      return out;
    },
    /**
     * Convert moleculer params to openapi definitions(components schemas)
     * @param doc
     * @param schemeName
     * @param obj
     * @param exclude{Array<string>}
     * @param parentNode
     */
    createSchemaFromParams(doc, schemeName, obj, exclude = [], parentNode = {}) {
      // Schema model
      // https://github.com/OAI/OpenAPI-Specification/blob/b748a884fa4571ffb6dd6ed9a4d20e38e41a878c/versions/3.0.3.md#models-with-polymorphism-support
      console.log('SCHEMA', schemeName, obj, exclude);
      doc.components.schemas[schemeName] = obj;

      if (obj.required?.length === 0) {
        delete obj.required;
      }
    },
    getTypeAndExample(node) {
      if (!node) {
        node = {};
      }
      let out = {};
      let nodeType = node.type;

      if (Array.isArray(nodeType)) {
        nodeType = (nodeType[0] || 'string').toString();
      }

      switch (nodeType) {
        case NODE_TYPES.boolean:
          out = {
            example: false,
            type: 'boolean',
          };
          break;
        case NODE_TYPES.number:
          out = {
            example: null,
            type: 'number',
          };
          break;
        case NODE_TYPES.date:
          out = {
            example: '1998-01-10T13:00:00.000Z',
            type: 'string',
            format: 'date-time',
          };
          break;
        case NODE_TYPES.uuid:
          out = {
            example: '10ba038e-48da-487b-96e8-8d3b99b6d18a',
            type: 'string',
            format: 'uuid',
          };
          break;
        case NODE_TYPES.email:
          out = {
            example: 'foo@example.com',
            type: 'string',
            format: 'email',
          };
          break;
        case NODE_TYPES.url:
          out = {
            example: 'https://example.com',
            type: 'string',
            format: 'uri',
          };
          break;
        case NODE_TYPES.enum:
          out = {
            type: 'string',
            enum: node.values,
            example: Array.isArray(node.values) ? node.values[0] : undefined,
          };
          break;
        default:
          out = {
            example: '',
            type: 'string',
          };
          break;
      }

      if (Array.isArray(node.enum)) {
        out.example = node.enum[0];
        out.enum = node.enum;
      }

      if (node.default) {
        out.default = node.default;
        delete out.example;
      }

      out.minLength = node.length || node.min;
      out.maxLength = node.length || node.max;

      /**
       * by DenisFerrero
       * @link https://github.com/grinat/moleculer-auto-openapi/issues/13
       */
      if (node.pattern && (node.pattern.length > 0 || node.pattern.source.length > 0)) {
        out.pattern = new RegExp(node.pattern).source;
      }

      return out;
    },
    mergePathItemObjects(orig = {}, toMerge = {}) {
      for (const key in toMerge) {
        // merge components
        if (key === 'components') {
          orig[key] = this.mergeObjects(orig[key], toMerge[key]);
          continue;
        }

        // merge responses
        if (key === 'responses') {
          orig[key] = this.mergeObjects(orig[key], toMerge[key]);

          // iterate codes
          for (const code in orig[key]) {
            // remove $ref if exist content
            if (orig[key][code] && orig[key][code].content) {
              delete orig[key][code].$ref;
            }
          }

          continue;
        }

        // replace non components attributes
        orig[key] = toMerge[key];
      }
      return orig;
    },
    mergeObjects(orig = {}, toMerge = {}) {
      for (const key in toMerge) {
        orig[key] = {
          ...(orig[key] || {}),
          ...toMerge[key],
        };
      }
      return orig;
    },
    /**
     * replace // to /
     * @param path
     * @returns {string}
     */
    normalizePath(path = '') {
      path = path.replace(/\/{2,}/g, '/');
      return path;
    },
    /**
     * convert /:table to /{table}
     * @param url
     * @returns {string|string}
     */
    formatParamUrl(url = '') {
      let start = url.indexOf('/:');
      if (start === -1) {
        return url;
      }

      const end = url.indexOf('/', ++start);

      if (end === -1) {
        return url.slice(0, start) + '{' + url.slice(++start) + '}';
      }

      return this.formatParamUrl(
        url.slice(0, start) + '{' + url.slice(++start, end) + '}' + url.slice(end)
      );
    },
    /**
     * extract params from /{table}
     * @param url
     * @returns {[]}
     */
    extractParamsFromUrl(url = '') {
      const params = [];
      const added = [];

      const matches = [...this.matchAll(/{(\w+)}/g, url)];
      for (const match of matches) {
        const [, name] = match;

        added.push(name);
        params.push({ name, in: 'path', required: true, schema: { type: 'string' } });
      }

      return [params, added];
    },
    /**
     * matchAll polyfill for es8 and older
     * @param regexPattern
     * @param sourceString
     * @returns {[]}
     */
    matchAll(regexPattern, sourceString) {
      const output = [];
      let match;
      // make sure the pattern has the global flag
      const regexPatternWithGlobal = RegExp(regexPattern, 'g');
      while ((match = regexPatternWithGlobal.exec(sourceString)) !== null) {
        // get rid of the string copy
        delete match.input;
        // store the match data
        output.push(match);
      }
      return output;
    },
    getFileContentRequestBodyScheme(openapiPath, method, actionType) {
      return {
        content: {
          ...(actionType === 'multipart'
            ? {
                'multipart/form-data': {
                  schema: {
                    type: 'object',
                    properties: {
                      file: {
                        type: 'array',
                        items: {
                          type: 'string',
                          format: 'binary',
                        },
                      },
                      someField: {
                        type: 'string',
                      },
                    },
                  },
                },
              }
            : {
                'application/octet-stream': {
                  schema: {
                    type: 'string',
                    format: 'binary',
                  },
                },
              }),
        },
      };
    },
  },
  started() {
    this.logger.info(
      `📜OpenAPI Docs server is available at http://0.0.0.0:${this.settings.port}${this.settings.uiPath}`
    );
  },
};
