const _ = require('lodash');
const { table } = require('../tables');

async function removeCourseByIds(ids, { soft, transacting: _transacting } = {}) {
  return global.utils.withTransaction(
    async (transacting) => {
      const courses = await table.groups.find(
        { id_$in: _.isArray(ids) ? ids : [ids], type: 'course' },
        { transacting }
      );
      await leemons.events.emit('before-remove-courses', { courses, soft, transacting });
      await table.groups.deleteMany({ id_$in: _.map(courses, 'id') }, { soft, transacting });
      await leemons.events.emit('after-remove-courses', { courses, soft, transacting });
      return true;
    },
    table.groups,
    _transacting
  );
}

module.exports = { removeCourseByIds };
