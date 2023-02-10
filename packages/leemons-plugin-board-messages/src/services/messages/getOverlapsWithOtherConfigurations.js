const _ = require('lodash');
const { table } = require('../tables');

async function getOverlapsWithOtherConfigurations(item, { transacting }) {
  const query = {
    zone: item.zone,
    status_$in: ['published', 'programmed'],
    $or: [
      { startDate_$lt: item.startDate, endDate_$gte: item.endDate },
      { endDate_$gte: item.startDate, startDate_$lte: item.startDate },
    ],
  };
  if (item.id) {
    query.id_$ne = item.id;
  }
  let ids = null;
  if (item.centers && item.centers.length) {
    if (!_.isArray(ids)) ids = [];
    const items = await table.messageConfigCenters.find(
      { center_$in: item.centers },
      { columns: ['messageConfig'], transacting }
    );
    ids.push(..._.map(items, 'messageConfig'));
  }
  if (item.programs && item.programs.length) {
    if (!_.isArray(ids)) ids = [];
    const items = await table.messageConfigPrograms.find(
      { program_$in: item.programs },
      { columns: ['messageConfig'], transacting }
    );
    ids.push(..._.map(items, 'messageConfig'));
  }
  if (item.profiles && item.profiles.length) {
    if (!_.isArray(ids)) ids = [];
    const items = await table.messageConfigProfiles.find(
      { profile_$in: item.profiles },
      { columns: ['messageConfig'], transacting }
    );
    ids.push(..._.map(items, 'messageConfig'));
  }
  if (item.classes && item.classes.length) {
    if (!_.isArray(ids)) ids = [];
    const items = await table.messageConfigClasses.find(
      { class_$in: item.classes },
      { columns: ['messageConfig'], transacting }
    );
    ids.push(..._.map(items, 'messageConfig'));
  }
  if (ids !== null) {
    query.id_$in = _.uniq(ids);
  }
  return ['miau'];
}

module.exports = { getOverlapsWithOtherConfigurations };
