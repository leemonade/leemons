const { set } = require('lodash');

/**
 * @async
 * @function findDates
 * @param {Object} params - Parameters for findDates
 * @param {Array<string>} params.instances - The ids of the instances to find dates for
 * @param {MoleculerContext} params.ctx - The Moleculer context.
 * @returns {Promise<Object>} The dates per instance
 * @throws {LeemonsError} When there is an error retrieving the dates
 */

async function findDates({ instances, ctx }) {
  const datesFound = await ctx.tx.db.Dates.find({ type: 'assignableInstance', instance: instances })
    .select(['id', 'instance', 'name', 'date'])
    .lean();

  const datesPerInstance = {};

  datesFound.forEach((date) => {
    const { instance, name: key, date: value } = date;
    set(datesPerInstance, `${instance}.${key}`, value);
  });

  return datesPerInstance;
}

module.exports = { findDates };
