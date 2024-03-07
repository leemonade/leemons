const _ = require('lodash');

async function getMessageIdsByFilters({ item, ctx }) {
  let ids = null;
  if (item.centers && item.centers.length) {
    const q = { center: [...item.centers, '*'] };
    if (ids !== null) {
      q.messageConfig = ids;
    }
    const items = await ctx.tx.db.MessageConfigCenters.find(q).select(['messageConfig']).lean();
    ids = _.map(items, 'messageConfig');
  }
  if (item.programs && item.programs.length) {
    const q = { program: [...item.programs, '*'] };
    if (ids !== null) {
      q.messageConfig = ids;
    }
    const items = await ctx.tx.db.MessageConfigPrograms.find(q).select(['messageConfig']).lean();
    ids = _.map(items, 'messageConfig');
  }
  if (item.profiles && item.profiles.length) {
    const q = { profile: [...item.profiles, '*'] };
    if (ids !== null) {
      q.messageConfig = ids;
    }
    const items = await ctx.tx.db.MessageConfigProfiles.find(q).select(['messageConfig']).lean();
    ids = _.map(items, 'messageConfig');
  }
  if (item.classes && item.classes.length) {
    const q = { class: [...item.classes, '*'] };
    if (ids !== null) {
      q.messageConfig = ids;
    }
    const items = await ctx.tx.db.MessageConfigClasses.find(q).select(['messageConfig']).lean();
    ids = _.map(items, 'messageConfig');
  }
  return ids;
}

module.exports = { getMessageIdsByFilters };
