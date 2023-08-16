const _ = require('lodash');
const { programsByIds } = require('./programsByIds');
const { duplicateCourseByIds } = require('../courses/duplicateCourseByIds');
const { duplicateSubjectByIds } = require('../subjects/duplicateSubjectByIds');
const { duplicateGroupByIds } = require('../groups/duplicateGroupByIds');
const { duplicateSubstageByIds } = require('../substages/duplicateSubstageByIds');
const { duplicateKnowledgeByIds } = require('../knowledges/duplicateKnowledgeByIds');
const { duplicateSubjectTypeByIds } = require('../subject-type/duplicateSubjectTypeByIds');
const { duplicateProgramCentersByProgramIds } = require('./duplicateProgramCentersByProgramIds');
const { duplicateProgramConfigsByProgramIds } = require('./duplicateProgramConfigsByProgramIds');
const { duplicateClassesByIds } = require('../classes/duplicateClassesByIds');

async function duplicateProgramByIds({ ids, ctx }) {
  const [rawPrograms, programs, classes] = await Promise.all([
    ctx.tx.db.Programs.find({ id: _.isArray(ids) ? ids : [ids] }).lean(),
    programsByIds({ ids: _.isArray(ids) ? ids : [ids], ctx }),
    ctx.tx.db.Class.find({ program: _.isArray(ids) ? ids : [ids] }).lean(),
  ]);
  await ctx.tx.emit('before-duplicate-programs', { programs });

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

  const duplications = {
    programs: {},
  };

  // ES: Empezamos la duplicación de los programas
  const newPrograms = await Promise.all(
    _.map(rawPrograms, ({ id, ...item }) => ctx.tx.db.Programs.create(item))
  );

  // Es: Añadimos los programas duplicados de tal forma que el indice es el id original y el valor es el nuevo item duplicado
  _.forEach(rawPrograms, ({ id }, index) => {
    duplications.programs[id] = newPrograms[index];
  });

  await duplicateSubjectTypeByIds({ ids: _.map(subjectTypes, 'id'), duplications, ctx });
  await duplicateKnowledgeByIds({ ids: _.map(knowledges, 'id'), duplications, ctx });
  await duplicateSubstageByIds({ ids: _.map(substages, 'id'), duplications, ctx });
  await duplicateGroupByIds({ ids: _.map(groups, 'id'), duplications, ctx });
  await duplicateCourseByIds({ ids: _.map(courses, 'id'), duplications, ctx });
  await duplicateSubjectByIds({ ids: _.map(subjects, 'id'), duplications, ctx });

  await duplicateProgramCentersByProgramIds({
    programIds: _.map(programs, 'id'),
    duplications,
    ctx,
  });
  await duplicateProgramConfigsByProgramIds({
    programIds: _.map(programs, 'id'),
    duplications,
    ctx,
  });

  await duplicateClassesByIds({
    ids: _.map(classes, 'id'),
    duplications,
    students: false,
    teachers: false,
    groups: true,
    courses: true,
    substages: true,
    knowledges: true,
    ctx,
  });

  await ctx.tx.emit('after-duplicate-programs', {
    programs,
    duplications: duplications.programs,
  });

  const newProgramIds = [];
  _.forIn(duplications.programs, ({ id }) => {
    newProgramIds.push(id);
  });

  return programsByIds({ ids: newProgramIds, ctx });
}

module.exports = { duplicateProgramByIds };
