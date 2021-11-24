const _ = require('lodash');
const { table } = require('../tables');
const { classByIds } = require('./classByIds');
const { removeByClass: removeKnowledgeByClass } = require('./knowledge/removeByClass');
const { removeByClass: removeSubstageByClass } = require('./substage/removeByClass');
const { removeByClass: removeStudentsByClass } = require('./student/removeByClass');
const { removeByClass: removeTeachersByClass } = require('./teacher/removeByClass');
const { removeByClass: removeCourseByClass } = require('./course/removeByClass');
const { removeByClass: removeGroupByClass } = require('./group/removeByClass');

async function removeClassesByIds(ids, { soft, transacting: _transacting } = {}) {
  return global.utils.withTransaction(
    async (transacting) => {
      const classes = await classByIds(ids, { transacting });
      const classesIds = _.map(classes, 'id');
      await leemons.events.emit('before-remove-classes', { classes, soft, transacting });

      await removeKnowledgeByClass(classesIds, { soft, transacting });
      await removeSubstageByClass(classesIds, { soft, transacting });
      await removeStudentsByClass(classesIds, { soft, transacting });
      await removeTeachersByClass(classesIds, { soft, transacting });
      await removeCourseByClass(classesIds, { soft, transacting });
      await removeGroupByClass(classesIds, { soft, transacting });

      const refClasses = await table.class.find(
        { class_$in: _.map(classes, 'id') },
        { transacting }
      );

      await removeClassesByIds(_.map(refClasses, 'id'), { soft, transacting });

      await table.class.deleteMany({ id_$in: _.map(classes, 'id') }, { soft, transacting });
      await leemons.events.emit('after-remove-classes', { classes, soft, transacting });
      return true;
    },
    table.class,
    _transacting
  );
}

module.exports = { removeClassesByIds };
