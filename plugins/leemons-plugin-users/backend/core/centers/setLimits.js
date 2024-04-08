const { LeemonsValidator } = require('@leemons/validator');
const _ = require('lodash');

/**
 * Set limits for a center
 *
 * @param {Object} params
 * @param {Array<CenterLimit>} params.limits - Limits to set
 * @param {string} params.centerId - Center identifier
 * @param {MoleculerContext} params.ctx - Context
 * @returns {Promise<Array<CenterLimit>>} Limits
 */
async function setLimits({ limits, centerId, ctx }) {
  const validator = new LeemonsValidator({
    type: 'object',
    properties: {
      limits: { type: 'array' },
      centerId: { type: 'string' },
    },
    required: ['limits', 'centerId'],
    additionalProperties: false,
  });

  if (!validator.validate({ limits, centerId })) {
    throw validator.error;
  }

  return Promise.all(
    _.map(limits, ({ id: limitId, createdAt, updatedAt, deletedAt, ...limit }) =>
      ctx.tx.db.CenterLimits.findOneAndUpdate(
        {
          item: limit.item,
          center: centerId,
        },
        {
          ...limit,
          center: centerId,
        },
        { upsert: true, new: true, lean: true }
      )
    )
  );
}

module.exports = { setLimits };
