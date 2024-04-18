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

  await removeKnowledgeByClass({ classIds: classesIds, soft, ctx });
  await removeSubstageByClass({ classIds: classesIds, soft, ctx });
  await removeStudentsByClass({ classIds: classesIds, soft, ctx });
  await removeTeachersByClass({ classIds: classesIds, soft, ctx });
  await removeCourseByClass({ classIds: classesIds, soft, ctx });
  await removeGroupByClass({ classIds: classesIds, soft, ctx });

  const refClasses = await ctx.tx.db.Class.find({ class: _.map(classes, 'id') }).lean();

  const refIds = _.isArray(refClasses) ? _.map(refClasses, 'id') : [];
  if (refIds?.length) {
    await removeClassesByIds({ ids: refIds, soft, ctx });
  }

  await ctx.tx.db.Class.deleteMany({ id: _.map(classes, 'id') }, { soft });
  // TODO: Borrar permiso de la clase a todo quisqui
  /*
   * permissions.removeItems */
  await ctx.tx.emit('after-remove-classes', { classes, soft });
  return true;
}

module.exports = { removeClassesByIds };
