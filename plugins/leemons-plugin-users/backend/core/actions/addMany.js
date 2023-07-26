const _ = require('lodash');
const { settledResponseToManyResponse } = require('leemons-utils');
const { add } = require('./add');

/**
 * Create multiple actions
 * @public
 * @static
 * @param {Object} params
 * @param {MoleculerContext} params.ctx Moleculer context
 * @param {ActionAdd[]} params.data - Array of actions to add
 * @return {Promise<ManyResponse>} Created actions
 * */
async function addMany({ data, ctx }) {
  const response = await Promise.allSettled(_.map(data, (d) => add({ ...d, ctx })));
  return settledResponseToManyResponse(response);
}

module.exports = { addMany };
