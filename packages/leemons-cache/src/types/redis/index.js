const _ = require('lodash');
const Redis = require('ioredis');
const { getActionNameFromCTX } = require('@leemons/service-name-parser');
const createQueries = require('./queries');

function getDefaultClientConfig() {
  const config = {
    url: process.env.CACHE_REDIS_URI,
    cluster: process.env.CACHE_REDIS_CLUSTER?.toLowerCase() === 'true',

    username: process.env.CACHE_REDIS_USERNAME,
    password: process.env.CACHE_REDIS_PASSWORD,
    name: process.env.CACHE_REDIS_NAME,
    database: process.env.CACHE_REDIS_DATABASE,
  };

  if (!config.url) {
    return null;
  }

  return config;
}

module.exports.getClientConfig = function getClientConfig(_config) {
  let config = _config;

  if (!config) {
    config = getDefaultClientConfig();
  }

  if (!config) {
    return null;
  }

  if (_.isString(config)) {
    return { url: config };
  }
  return {
    url: _.get(config, 'url', undefined),
    cluster: !!_.get(config, 'cluster', false),
  };
};

function tracingWrapper(f, ctx) {
  return (...params) => {
    if (!ctx?.span) {
      return f(...params);
    }

    const span = ctx.broker.tracer.startSpan(`redis ${f.name}`, {
      parentSpan: ctx.span,
      type: 'cache',
      service: 'redis',
      tags: {
        params,
        action: getActionNameFromCTX(ctx),
        method: f.name,
      },
    });

    return f(...params)
      .then((res) => {
        span.finish();
        return res;
      })
      .catch((error) => {
        span.setError(error);
        span.finish();
        throw error;
      });
  };
}

module.exports.redisCache = async function redisCache(config) {
  let client;

  if (!config.cluster) {
    client = new Redis(config.url);
  } else {
    throw new Error('redis cluster not supported');
  }

  client.on('error', (error) => console.error(`Redis Error: ${error.message}`));

  const queries = createQueries(client, { isCluster: config.cluster });

  return ({ pluginName, ctx }) => {
    const queriesObject = queries(pluginName);

    return Object.fromEntries(
      Object.entries(queriesObject).map(([key, f]) => [key, tracingWrapper(f, ctx)])
    );
  };
};
