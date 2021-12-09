const _ = require('lodash');
const { table } = require('../tables');
const { add: addCalendar } = require('../calendar/add');
const { validateAddClassroomLevel } = require('../../validations/forms');
const { validateExistClassroomLevel } = require('../../validations/exists');

/**
 *
 * @public
 * @static
 * @param {any} data
 * @param {any=} transacting - DB Transaction
 * @return {Promise<any>}
 * */
async function add(data, { userSession, transacting: _transacting } = {}) {
  validateAddClassroomLevel(data);

  return global.utils.withTransaction(
    async (transacting) => {
      await validateExistClassroomLevel(data.level, { transacting });

      const levelsTree = await leemons
        .getPlugin('classroom')
        .services.levels.getAllParents(data.level, {
          userSession,
        });

      const centerLevel = _.find(levelsTree, { properties: { isCenter: true } });
      if (!centerLevel) throw new Error('It is necessary to select at least up to the center');

      const calendar = await addCalendar.call(
        { calledFrom: leemons.plugin.prefixPN('') },
        leemons.plugin.prefixPN(`classroom.level.${data.level}`),
        {
          section: 'plugins.calendar.user_section',
          name: leemons.plugin.prefixPN(`classroom.level.${data.level}`),
          bgColor: '#333',
          borderColor: '#333',
        },
        { transacting }
      );

      const result = await table.classroomLevelCalendars.create(
        {
          ...data,
          calendar: calendar.id,
        },
        { transacting }
      );
      return {
        ...result,
      };
    },
    table.calendars,
    _transacting
  );
}

module.exports = { add };
