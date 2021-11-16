const _ = require('lodash');
const { table } = require('../../tables');

async function removeByClass(classIds, { soft, transacting: _transacting } = {}) {
  return global.utils.withTransaction(
    async (transacting) => {
      const classCourses = await table.classCourse.find(
        { class_$in: _.isArray(classIds) ? classIds : [classIds] },
        { transacting }
      );
      await leemons.events.emit('before-remove-classes-courses', {
        classCourses,
        soft,
        transacting,
      });
      await table.classCourse.deleteMany(
        { id_$in: _.map(classCourses, 'id') },
        { soft, transacting }
      );
      await leemons.events.emit('after-remove-classes-courses', {
        classCourses,
        soft,
        transacting,
      });
      return true;
    },
    table.classCourse,
    _transacting
  );
}

module.exports = { removeByClass };
