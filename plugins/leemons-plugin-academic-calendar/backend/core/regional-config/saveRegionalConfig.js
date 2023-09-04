/* eslint-disable no-param-reassign */
const _ = require('lodash');
const { validateSaveRegionalConfig } = require('../../validations/forms');

async function saveRegionalConfig(
  {
    created_at,
    updated_at,
    deleted_at,
    deleted,
    createdAt,
    updatedAt,
    deletedAt,
    isDeleted,
    _id,
    __v,
    ...data,
      ctx
  },
) {
  validateSaveRegionalConfig(data);
  let config;

  data.regionalEvents = JSON.stringify(data.regionalEvents);
  data.localEvents = JSON.stringify(data.localEvents);
  data.daysOffEvents = JSON.stringify(data.daysOffEvents);
  if (data.id) {
    config = await ctx.tx.db.RegionalConfig.findOneAndUpdate({ id: data.id }, data, {
      new: true,
      lean: true,
    });
  } else {
    config = await ctx.tx.db.RegionalConfig.create(data);
    config = config.toObject();
  }
  return config;
}

module.exports = { saveRegionalConfig };
