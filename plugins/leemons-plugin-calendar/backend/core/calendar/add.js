const {
  validateKeyPrefix,
  validateExistCalendarKey,
  validateSectionPrefix,
} = require('../../validations/exists');
const { getPermissionConfig } = require('./getPermissionConfig');
const { validateAddCalendar } = require('../../validations/forms');

/**
 * Add calendar with the provided key if not already exists
 * @public
 * @static
 * @param {string} key - key
 * @param {any} config - Calendar config
 * @param {any=} transacting - DB Transaction
 * @return {Promise<any>}
 * */
async function add({ key, config, ctx }) {
  validateKeyPrefix({ key, calledFrom: ctx.callerPlugin, ctx });
  validateSectionPrefix({ key: config.section, calledFrom: ctx.callerPlugin, ctx });
  validateAddCalendar(config);

  await validateExistCalendarKey({ key, ctx });

  const permissionConfig = getPermissionConfig(key);
  const calendar = await ctx.tx.db.Calendars.create({
    key,
    ...config,
    metadata: JSON.stringify(config.metadata),
  });
  // await leemons
  //   .getPlugin('users')
  //   .services.permissions.addItem(calendar.id, permissionConfig.type, permissionConfig.all, {
  //     isCustomPermission: true,
  //     transacting,
  //   });

  await ctx.tx.call('users.permissions.addItem', {
    item: calendar.id,
    type: permissionConfig.type,
    data: permissionConfig.all,
    isCurrentPermission: true,
  });

  return calendar;
}

module.exports = { add };
