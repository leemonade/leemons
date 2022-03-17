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
      const classes = await classByIds(_.isArray(ids) ? ids : [ids], { transacting });
      const classesIds = _.map(classes, 'id');
      await leemons.events.emit('before-remove-classes', { classes, soft, transacting });

      await leemons.getPlugin('users').services.permissions.removeItems({
        item_$in: _.map(classes, 'id'),
        type: 'plugins.academic-portfolio.class',
      });

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

      const refIds = _.isArray(refClasses) ? _.map(refClasses, 'id') : [];
      if (refIds && refIds.length) {
        await removeClassesByIds(refIds, { soft, transacting });
      }

      await leemons.events.emit('before-remove-classes', { classes, soft, transacting });
      await table.class.deleteMany({ id_$in: _.map(classes, 'id') }, { soft, transacting });
      // TODO: Borrar permiso de la clase a todo quisqui
      /*
       * permissions.removeItems */
      await leemons.events.emit('after-remove-classes', { classes, soft, transacting });
      return true;
    },
    table.class,
    _transacting
  );
}

module.exports = { removeClassesByIds };
