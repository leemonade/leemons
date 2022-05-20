const _ = require('lodash');

module.exports = async function registerEvent(assignable, classes, { dates, transacting } = {}) {
  return leemons.getPlugin('calendar').services.calendar.addEvent(
    _.map(classes, (classe) => `plugins.calendar.class.${classe}`),
    {
      title: assignable.asset.name,
      isPrivate: true,
      type: 'plugins.calendar.task',
      startDate: dates.start,
      endDate: dates.deadline,
    },
    { transacting }
  );
};
