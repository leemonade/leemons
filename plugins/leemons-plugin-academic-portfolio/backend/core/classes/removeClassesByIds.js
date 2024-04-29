const _ = require('lodash');
const { classByIds } = require('./classByIds');
const { removeByClass: removeKnowledgeByClass } = require('./knowledge/removeByClass');
const { removeByClass: removeSubstageByClass } = require('./substage/removeByClass');
const { removeByClass: removeStudentsByClass } = require('./student/removeByClass');
const { removeByClass: removeTeachersByClass } = require('./teacher/removeByClass');
const { removeByClass: removeCourseByClass } = require('./course/removeByClass');
const { removeByClass: removeGroupByClass } = require('./group/removeByClass');

async function removeClassesByIds({ ids, soft, ctx }) {
  const classes = await classByIds({ ids: _.isArray(ids) ? ids : [ids], ctx });
  const classesIds = _.map(classes, 'id');
  await ctx.tx.emit('before-remove-classes', { classes, soft });

  await ctx.tx.call('users.permissions.removeItems', {
    query: {
      item: _.map(classes, 'id'),
      type: 'academic-portfolio.class',
    },
  });

  await Promise.allSettled(
    _.map(classes, (classe) => {
      if (classe.image) {
        return ctx.tx.call('leebrary.assets.remove', {
          id: { id: classe.image.id },
        });
      }
      return Promise.resolve();
    })
  );

  console.log('removing classes by ids, ids =>', ids);
  console.log('removing classes by ids, soft =>', soft);
  await removeKnowledgeByClass({ classIds: classesIds, soft, ctx });
  console.log('removed knowledge area - class relationship');
  await removeSubstageByClass({ classIds: classesIds, soft, ctx });
  console.log('removed substage-class relationship');
  await removeStudentsByClass({ classIds: classesIds, soft, ctx });
  await removeTeachersByClass({ classIds: classesIds, soft, ctx });
  console.log('Removed students and teachers');
  await removeCourseByClass({ classIds: classesIds, soft, ctx });
  await removeGroupByClass({ classIds: classesIds, soft, ctx });

  const refClasses = await ctx.tx.db.Class.find({ class: _.map(classes, 'id') }).lean();
  console.log('refClasses ?? No debería haber... =>', refClasses);

  const refIds = _.isArray(refClasses) ? _.map(refClasses, 'id') : [];
  if (refIds?.length) {
    await removeClassesByIds({ ids: refIds, soft, ctx });
  }

  console.log('It will remove these classes =>', _.map(classes, 'id'));
  await ctx.tx.db.Class.deleteMany({ id: _.map(classes, 'id') }, { soft });
  console.log('After removing classes, before emiting event');

  // TODO: Borrar permiso de la clase a todo quisqui
  /*
   * permissions.removeItems */
  await ctx.tx.emit('after-remove-classes', { classes, soft });
  return true;
}

module.exports = { removeClassesByIds };
