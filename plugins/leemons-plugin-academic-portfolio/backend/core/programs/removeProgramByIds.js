const _ = require('lodash');
const { programsByIds } = require('./programsByIds');
const { removeGroupByIds } = require('../groups/removeGroupByIds');
const { removeCourseByIds } = require('../courses/removeCourseByIds');
const { removeSubstageByIds } = require('../substages/removeSubstageByIds');
const { removeKnowledgeByIds } = require('../knowledges/removeKnowledgeByIds');
const { removeSubjectTypeByIds } = require('../subject-type/removeSubjectTypeByIds');
const { removeSubjectByIds } = require('../subjects/removeSubjectByIds');
const { removeProgramCentersByProgramIds } = require('./removeProgramCentersByProgramIds');
const { removeProgramConfigsByProgramIds } = require('./removeProgramConfigsByProgramIds');
const { removeClassesByIds } = require('../classes/removeClassesByIds');

async function removeProgramByIds({ ids, soft, ctx } = {}) {
  const [programs, classes] = await Promise.all([
    programsByIds({ ids: _.isArray(ids) ? ids : [ids], ctx }),
    ctx.tx.Class.find({ program: _.isArray(ids) ? ids : [ids] }).lean(),
  ]);
  await ctx.tx.emit('before-remove-programs', { programs, soft });

  let groups = [];
  let courses = [];
  let subjects = [];
  let substages = [];
  let knowledges = [];
  let subjectTypes = [];
  _.forEach(programs, (program) => {
    groups = _.concat(groups, program.groups);
    courses = _.concat(courses, program.courses);
    subjects = _.concat(subjects, program.subjects);
    substages = _.concat(substages, program.substages);
    knowledges = _.concat(knowledges, program.knowledges);
    substages = _.concat(substages, program.customSubstages);
    subjectTypes = _.concat(subjectTypes, program.subjectTypes);
  });
  // ES: Eliminamos primero las clases y las asignaturas por que si no la bbdd da error por las claves foraneas
  // EN: First we delete the classes and subjects because if the database gives an error for foreign keys
  await removeClassesByIds({ ids: _.map(classes, 'id'), soft, ctx });
  await removeSubjectByIds({ ids: _.map(subjects, 'id'), soft, ctx });

  // ES: Eliminamos el resto de datos
  // EN: Delete the rest of data
  await removeGroupByIds({ ids: _.map(groups, 'id'), soft, ctx });
  await removeCourseByIds({ ids: _.map(courses, 'id'), soft, ctx });
  await removeSubstageByIds({ ids: _.map(substages, 'id'), soft, ctx });
  await removeKnowledgeByIds({ ids: _.map(knowledges, 'id'), soft, ctx });
  await removeSubjectTypeByIds({ ids: _.map(subjectTypes, 'id'), soft, ctx });
  await removeProgramConfigsByProgramIds({ programIds: _.map(programs, 'id'), soft, ctx });
  await removeProgramCentersByProgramIds({ programIds: _.map(programs, 'id'), soft, ctx });
  await ctx.tx.db.Programs.deleteMany({ id: _.map(programs, 'id') }, { soft, ctx });

  await ctx.tx.emit('after-remove-programs', { programs, soft, ctx });
  return true;
}

module.exports = { removeProgramByIds };
