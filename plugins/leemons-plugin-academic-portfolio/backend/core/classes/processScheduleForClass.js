const _ = require('lodash');

async function processScheduleForClass({ schedule, classId, ctx }) {
  const timetables = await ctx.tx.call('timetable.timetable.get', { classId, ctx });

  const alreadyIds = _.map(timetables, 'id');
  const toCreate = _.filter(schedule, ({ id }) => !id);
  const toUpdate = _.filter(schedule, ({ id }) => id && alreadyIds.includes(id));
  const toUpdateIds = _.map(toUpdate, 'id');
  const toDelete = _.filter(alreadyIds, (id) => !toUpdateIds.includes(id));

  return Promise.all([
    // Create
    Promise.all(
      _.map(toCreate, (item) =>
        ctx.tx.call('timetable.timetable.create', { class: classId, ...item })
      )
    ),

    // Update
    Promise.all(
      _.map(toUpdate, ({ id, ...item }) =>
        ctx.tx.call('timetable.timetable.update', {
          timetableId: id,
          ...item,
        })
      )
    ),

    // Delete
    Promise.all(
      _.map(toDelete, (id) =>
        ctx.tx.call('timetable.timetable.delete', {
          timetableId: id,
          ctx,
        })
      )
    ),
  ]);
}

module.exports = { processScheduleForClass };
