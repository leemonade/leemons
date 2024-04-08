const _ = require('lodash');
const { getPluginNameFromCTX } = require('@leemons/service-name-parser');
const Moleculer = require('moleculer');

function errorMessage(message) {
  return `[LeemonsError] - ${message}`;
}

class LeemonsError extends Moleculer.Errors.MoleculerError {
  constructor(
    ctx,
    { message, httpStatusCode, customCode, allowedPermissions, ignoreStack, ...rest }
  ) {
    if (!ctx) throw new Error(errorMessage('ctx field is required'));
    if (!ctx.service?.name) throw new Error(errorMessage('ctx must be a valid moleculer context'));
    if (!message) throw new Error(errorMessage('message field is required'));

    const data = {
      pluginName: getPluginNameFromCTX(ctx),
      pluginVersion: ctx.service.version,
      httpStatusCode,
      code: customCode,
      allowedPermissions,
      ignoreStack,
    };

    if (httpStatusCode) {
      super(message, httpStatusCode, 'LEEMONS_ERROR', data);
    } else {
      super(message, 400, 'LEEMONS_ERROR', data);
    }
    _.forIn(rest, (value, key) => {
      this[key] = value;
    });
  }
}

module.exports = { LeemonsError };
