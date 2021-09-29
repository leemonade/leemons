const { add } = require('./add');
const { exist } = require('./exist');
const { detailByKey } = require('./detailByKey');
const { getPermissionConfig } = require('./getPermissionConfig');
const { getCalendarsToFrontend } = require('./getCalendarsToFrontend');
const { grantAccessUserAgentToCalendar } = require('./grantAccessUserAgentToCalendar');

module.exports = {
  add,
  exist,
  detailByKey,
  getPermissionConfig,
  getCalendarsToFrontend,
  grantAccessUserAgentToCalendar,
};
