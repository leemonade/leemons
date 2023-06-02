const _ = require('lodash');
const slugify = require('slugify');
const existName = require('./existName');
const createNecessaryRolesForProfilesAccordingToCenters = require('../profiles/createNecessaryRolesForProfilesAccordingToCenters');
/**
 * Create one center
 * @private
 * @static
 * @param {Object} params
 * @param {MoleculerContext} params.ctx Moleculer context
 * @param {CenterAdd} params.data
 * @return {Promise<Center>} Created / Updated role
 * */
async function add({ _id, name, locale, limits, ctx, ...centerData }) {
  if (await existName({ name, _id, ctx }))
    throw new Error(`Center with name '${name}' already exists`);

  if (!(await ctx.tx.call('multilanguage.locales.has', { code: locale }))) {
    throw new Error(`The locale '${locale}' not exists`);
  }

  let center = null;
  if (_id) {
    center = await ctx.tx.db.Centers.findByIdAndUpdate(
      _id,
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
    await createNecessaryRolesForProfilesAccordingToCenters({
      profileIds: undefined,
      centerIds: center._id,
      ctx,
    });
    await ctx.tx.emit('didCreateCenter');
  }

  if (limits) {
    center.limits = await Promise.all(
      _.map(limits, ({ _id, createdAt, updatedAt, deletedAt, ...limit }) =>
        ctx.tx.db.CenterLimits.findOneAndUpdate(
          {
            item: limit.item,
            center: center._id,
          },
          {
            ...limit,
            center: center._id,
          },
          { upsert: true, new: true }
        )
      )
    );
  }

  return center;
}

module.exports = add;
