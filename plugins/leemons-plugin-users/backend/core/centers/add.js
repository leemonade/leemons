const _ = require('lodash');
const { LeemonsError } = require('@leemons/error');
const slugify = require('slugify');
const existName = require('./existName');
const createNecessaryRolesForProfilesAccordingToCenters = require('../profiles/createNecessaryRolesForProfilesAccordingToCenters');
const { setLimits } = require('./setLimits');

/**
 * Create one center
 * @private
 * @static
 * @param {Object} params
 * @param {string} params.id - Unique identifier of the center
 * @param {string} params.name - Name of the center
 * @param {string} params.locale - Locale of the center
 * @param {Array<CenterLimit>} params.limits - Limits of the center
 * @param {Object} params.centerData - Center data
 * @param {MoleculerContext} params.ctx Moleculer context
 * @return {Promise<Center>} Created / Updated center
 * */
async function add({ id, name, locale, limits, ctx, ...centerData }) {
  if (await existName({ name, id, ctx }))
    throw new LeemonsError(ctx, { message: `Center with name '${name}' already exists` });

  if (!(await ctx.tx.call('multilanguage.locales.has', { code: locale }))) {
    throw new LeemonsError(ctx, { message: `The locale '${locale}' not exists` });
  }

  let center = null;
  if (id) {
    center = await ctx.tx.db.Centers.findByIdAndUpdate(
      id,
      {
        ...centerData,
        name,
        locale,
        uri: slugify(name, { lower: true }),
      },
      { lean: true, new: true }
    );
    await ctx.tx.emit('didUpdateCenter');
  } else {
    center = await ctx.tx.db.Centers.create({
      ...centerData,
      name,
      locale,
      uri: slugify(name, { lower: true }),
    });
    center = center.toObject();
    await createNecessaryRolesForProfilesAccordingToCenters({
      profileIds: undefined,
      centerIds: center.id,
      ctx,
    });
    await ctx.tx.emit('didCreateCenter');
  }

  if (limits) {
    center.limits = await setLimits({ limits, centerId: center.id, ctx });
  }

  return center;
}

module.exports = add;
