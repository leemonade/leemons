const _ = require('lodash');
const { getPluginNameFromCTX } = require('leemons-service-name-parser');

function errorMessage(message) {
  return `[LeemonsError] - ${message}`;
}

class LeemonsError extends Error {
  constructor(ctx, { message, httpStatusCode, customCode, ...rest }) {
    if (!ctx) throw new Error(errorMessage('ctx field is required'));
    if (!ctx.service || !ctx.service.name)
      throw new Error(errorMessage('ctx must be a valid moleculer context'));
    if (!message) throw new Error(errorMessage('message field is required'));
    if (httpStatusCode) {
      ctx.meta.$statusCode = httpStatusCode;
    }
    super(message);
    _.forIn(rest, (value, key) => {
      this[key] = value;
    });
    this.pluginName = getPluginNameFromCTX(ctx);
    this.pluginVersion = ctx.service.version;
    this.httpStatusCode = httpStatusCode;
    this.code = customCode;
  }
}

module.exports = { LeemonsError };
