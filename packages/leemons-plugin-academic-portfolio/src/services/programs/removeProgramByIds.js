const _ = require('lodash');
const { table } = require('../tables');
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

async function removeProgramByIds(ids, { userSession, soft, transacting: _transacting } = {}) {
  return global.utils.withTransaction(
    async (transacting) => {
      const [programs, classes] = await Promise.all([
        programsByIds(_.isArray(ids) ? ids : [ids], { userSession, transacting }),
        table.class.find({ program_$in: _.isArray(ids) ? ids : [ids] }, { transacting }),
      ]);
      await leemons.events.emit('before-remove-programs', { programs, soft, transacting });

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
      await removeClassesByIds(_.map(classes, 'id'), { userSession, soft, transacting });
      await removeSubjectByIds(_.map(subjects, 'id'), { userSession, soft, transacting });

      // ES: Eliminamos el resto de datos
      // EN: Delete the rest of data
      await removeGroupByIds(_.map(groups, 'id'), { soft, transacting });
      await removeCourseByIds(_.map(courses, 'id'), { soft, transacting });
      await removeSubstageByIds(_.map(substages, 'id'), { soft, transacting });
      await removeKnowledgeByIds(_.map(knowledges, 'id'), { soft, transacting });
      await removeSubjectTypeByIds(_.map(subjectTypes, 'id'), { soft, transacting });
      await removeProgramConfigsByProgramIds(_.map(programs, 'id'), { soft, transacting });
      await removeProgramCentersByProgramIds(_.map(programs, 'id'), { soft, transacting });
      await table.programs.deleteMany({ id_$in: _.map(programs, 'id') }, { soft, transacting });

      await leemons.events.emit('after-remove-programs', { programs, soft, transacting });
      return true;
    },
    table.programCenter,
    _transacting
  );
}

module.exports = { removeProgramByIds };
