/* eslint-disable no-param-reassign */
const _ = require('lodash');

async function getScheduleToFrontend(userSession, { transacting } = {}) {
  const classes = await leemons
    .getPlugin('academic-portfolio')
    .services.classes.listSessionClasses(userSession, undefined, { transacting });

  // classes = _.filter(classes, {program:});
}

module.exports = { getScheduleToFrontend };
