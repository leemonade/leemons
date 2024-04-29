const _ = require('lodash');
const { programsByIds } = require('./programsByIds');
const { removeGroupByIds } = require('../groups/removeGroupByIds');
const { removeCourseByIds } = require('../courses/removeCourseByIds');
const { removeSubstageByIds } = require('../substages/removeSubstageByIds');
const { removeSubjectByIds } = require('../subjects/removeSubjectByIds');
const { removeProgramCentersByProgramIds } = require('./removeProgramCentersByProgramIds');
const { removeProgramConfigsByProgramIds } = require('./removeProgramConfigsByProgramIds');
const { removeClassesByIds } = require('../classes/removeClassesByIds');

async function removeProgramByIds({ ids, soft, ctx }) {
  const [programs, classes] = await Promise.all([
    programsByIds({ ids: _.isArray(ids) ? ids : [ids], ctx }),
    ctx.tx.db.Class.find({ program: _.isArray(ids) ? ids : [ids] }).lean(),
  ]);
  await ctx.tx.emit('before-remove-programs', { programs, soft });

  let groups = [];
  let courses = [];
  let subjects = [];
  let substages = [];
  _.forEach(programs, (program) => {
    groups = _.concat(groups, program.groups);
    courses = _.concat(courses, program.courses);
    subjects = _.concat(subjects, program.subjects);
    substages = _.concat(substages, program.substages);
    substages = _.concat(substages, program.customSubstages);
  });
  // ES: Eliminamos primero las clases y las asignaturas por que si no la bbdd da error por las claves foraneas
  // EN: First we delete the classes and subjects because if the database gives an error for foreign keys
  console.log('------------------- Removing classes -------------------');
  await removeClassesByIds({ ids: _.map(classes, 'id'), soft, ctx });

  console.log('------------------- Removing subjects -------------------');
  await removeSubjectByIds({ ids: _.map(subjects, 'id'), soft, ctx });

  // ES: Eliminamos el resto de datos
  // EN: Delete the rest of data
  console.log('------------------- Removing groups -------------------');
  await removeGroupByIds({ ids: _.map(groups, 'id'), soft, ctx });

  console.log('------------------- Removing courses -------------------');
  await removeCourseByIds({ ids: _.map(courses, 'id'), soft, ctx });

  console.log('------------------- Removing substages -------------------');
  await removeSubstageByIds({ ids: _.map(substages, 'id'), soft, ctx });

  console.log('------------------- Removing program configs -------------------');
  await removeProgramConfigsByProgramIds({ programIds: _.map(programs, 'id'), soft, ctx });

  console.log('------------------- Removing program center relationship -------------------');
  await removeProgramCentersByProgramIds({ programIds: _.map(programs, 'id'), soft, ctx });

  console.log('------------------- Removing programs -------------------');
  console.log('programs to delete =>', _.map(programs, 'id'));
  await ctx.tx.db.Programs.deleteMany({ id: _.map(programs, 'id') }, { soft });

  await ctx.tx.emit('after-remove-programs', { programs, soft, ctx });
  return true;
}

module.exports = { removeProgramByIds };
