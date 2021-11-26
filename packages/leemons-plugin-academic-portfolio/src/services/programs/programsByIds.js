const _ = require('lodash');
const { table } = require('../tables');
const { getProgramSubjectTypes } = require('./getProgramSubjectTypes');
const { getProgramSubjects } = require('./getProgramSubjects');
const { getProgramKnowledges } = require('./getProgramKnowledges');
const { getProgramGroups } = require('./getProgramGroups');
const { getProgramCourses } = require('./getProgramCourses');
const { getProgramSubstages } = require('./getProgramSubstages');

async function programsByIds(ids, { transacting } = {}) {
  const [programs, programCenter, substages, courses, groups, knowledges, subjects, subjectTypes] =
    await Promise.all([
      table.programs.find({ id_$in: _.isArray(ids) ? ids : [ids] }, { transacting }),
      table.programCenter.find({ program_$in: _.isArray(ids) ? ids : [ids] }, { transacting }),
      getProgramSubstages(ids, { transacting }),
      getProgramCourses(ids, { transacting }),
      getProgramGroups(ids, { transacting }),
      getProgramKnowledges(ids, { transacting }),
      getProgramSubjects(ids, { transacting }),
      getProgramSubjectTypes(ids, { transacting }),
    ]);

  const groupsByProgram = _.groupBy(groups, 'program');
  const coursesByProgram = _.groupBy(courses, 'program');
  const substageByProgram = _.groupBy(substages, 'program');
  const knowledgesByProgram = _.groupBy(knowledges, 'program');
  const subjectsByProgram = _.groupBy(subjects, 'program');
  const subjectTypesByProgram = _.groupBy(subjectTypes, 'program');
  const centersByProgram = _.groupBy(programCenter, 'program');

  return programs.map((program) => ({
    ...program,
    centers: centersByProgram[program.id] ? _.map(centersByProgram[program.id], 'center') : [],
    groups: groupsByProgram[program.id] ? groupsByProgram[program.id] : [],
    courses: coursesByProgram[program.id] ? coursesByProgram[program.id] : [],
    knowledges: knowledgesByProgram[program.id] ? knowledgesByProgram[program.id] : [],
    subjects: subjectsByProgram[program.id] ? subjectsByProgram[program.id] : [],
    subjectTypes: subjectTypesByProgram[program.id] ? subjectTypesByProgram[program.id] : [],
    substages: substageByProgram[program.id]
      ? _.filter(substageByProgram[program.id], ({ number }) => _.isNil(number))
      : [],
    customSubstages: substageByProgram[program.id]
      ? _.filter(substageByProgram[program.id], ({ number }) => !_.isNil(number))
      : [],
  }));
}

module.exports = { programsByIds };
