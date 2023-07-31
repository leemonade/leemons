const _ = require('lodash');
const { table } = require('../tables');
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

async function duplicateProgramByIds(ids, { userSession, transacting: _transacting } = {}) {
  return global.utils.withTransaction(
    async (transacting) => {
      const [rawPrograms, programs, classes] = await Promise.all([
        table.programs.find({ id_$in: _.isArray(ids) ? ids : [ids] }, { transacting }),
        programsByIds(_.isArray(ids) ? ids : [ids], { userSession, transacting }),
        table.class.find({ program_$in: _.isArray(ids) ? ids : [ids] }, { transacting }),
      ]);
      await leemons.events.emit('before-duplicate-programs', { programs, transacting });

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
        _.map(rawPrograms, ({ id, ...item }) => table.programs.create(item, { transacting }))
      );

      // Es: Añadimos los programas duplicados de tal forma que el indice es el id original y el valor es el nuevo item duplicado
      _.forEach(rawPrograms, ({ id }, index) => {
        duplications.programs[id] = newPrograms[index];
      });

      await duplicateSubjectTypeByIds(_.map(subjectTypes, 'id'), { duplications, transacting });
      await duplicateKnowledgeByIds(_.map(knowledges, 'id'), { duplications, transacting });
      await duplicateSubstageByIds(_.map(substages, 'id'), { duplications, transacting });
      await duplicateGroupByIds(_.map(groups, 'id'), { duplications, transacting });
      await duplicateCourseByIds(_.map(courses, 'id'), { duplications, transacting });
      await duplicateSubjectByIds(_.map(subjects, 'id'), { duplications, transacting });

      await duplicateProgramCentersByProgramIds(_.map(programs, 'id'), {
        duplications,
        transacting,
      });
      await duplicateProgramConfigsByProgramIds(_.map(programs, 'id'), {
        duplications,
        transacting,
      });

      await duplicateClassesByIds(_.map(classes, 'id'), {
        duplications,
        students: false,
        teachers: false,
        groups: true,
        courses: true,
        substages: true,
        knowledges: true,
        userSession,
        transacting,
      });

      await leemons.events.emit('after-duplicate-programs', {
        programs,
        duplications: duplications.programs,
        transacting,
      });

      const newProgramIds = [];
      _.forIn(duplications.programs, ({ id }) => {
        newProgramIds.push(id);
      });

      return programsByIds(newProgramIds, { userSession, transacting });
    },
    table.programCenter,
    _transacting
  );
}

module.exports = { duplicateProgramByIds };
