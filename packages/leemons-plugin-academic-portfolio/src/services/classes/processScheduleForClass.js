const _ = require('lodash');
const { table } = require('../tables');

async function processScheduleForClass(schedule, classId, { transacting: _transacting } = {}) {
  return global.utils.withTransaction(
    async (transacting) => {
      const timetableService = leemons.getPlugin('timetable').services.timetable;
      const timetables = await timetableService.get(classId, { transacting });

      const alreadyIds = _.map(timetables, 'id');
      const toCreate = _.filter(schedule, ({ id }) => !id);
      const toUpdate = _.filter(schedule, ({ id }) => id && alreadyIds.includes(id));
      const toUpdateIds = _.map(toUpdate, 'id');
      const toDelete = _.filter(alreadyIds, (id) => !toUpdateIds.includes(id));

      return Promise.all([
        // Create
        Promise.all(
          _.map(toCreate, (item) =>
            timetableService.create(
              {
                ...item,
                class: classId,
              },
              { transacting }
            )
          )
        ),
        // Update
        Promise.all(
          _.map(toUpdate, ({ id, ...item }) =>
            timetableService.update(
              id,
              {
                ...item,
              },
              { transacting }
            )
          )
        ),
        // Delete
        Promise.all(_.map(toDelete, (id) => timetableService.delete(id, { transacting }))),
      ]);
    },
    table.groups,
    _transacting
  );
}

module.exports = { processScheduleForClass };
