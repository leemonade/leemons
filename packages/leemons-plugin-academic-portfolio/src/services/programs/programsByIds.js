const _ = require('lodash');
const { table } = require('../tables');
const { getProgramSubjectTypes } = require('./getProgramSubjectTypes');
const { getProgramSubjects } = require('./getProgramSubjects');
const { getProgramKnowledges } = require('./getProgramKnowledges');
const { getProgramGroups } = require('./getProgramGroups');
const { getProgramCourses } = require('./getProgramCourses');
const { getProgramSubstages } = require('./getProgramSubstages');
const { getProgramTreeTypes } = require('./getProgramTreeTypes');
const { getProgramCycles } = require('./getProgramCycles');

async function programsByIds(ids, { onlyProgram, userSession, transacting } = {}) {
  if (onlyProgram) {
    return table.programs.find({ id_$in: _.isArray(ids) ? ids : [ids] }, { transacting });
  }

  const [
    programs,
    programCenter,
    substages,
    courses,
    groups,
    knowledges,
    subjects,
    subjectTypes,
    cycles,
  ] = await Promise.all([
    table.programs.find({ id_$in: _.isArray(ids) ? ids : [ids] }, { transacting }),
    table.programCenter.find({ program_$in: _.isArray(ids) ? ids : [ids] }, { transacting }),
    getProgramSubstages(ids, { transacting }),
    getProgramCourses(ids, { transacting }),
    getProgramGroups(ids, { transacting }),
    getProgramKnowledges(ids, { transacting }),
    getProgramSubjects(ids, { transacting }),
    getProgramSubjectTypes(ids, { transacting }),
    getProgramCycles(ids, { transacting }),
  ]);

  let imagesById = null;
  if (userSession) {
    const assetService = leemons.getPlugin('leebrary').services.assets;
    const images = await assetService.getByIds(_.map(programs, 'image'), {
      withFiles: true,
      userSession,
      transacting,
    });
    imagesById = _.keyBy(images, 'id');
  }

  const groupsByProgram = _.groupBy(groups, 'program');
  const coursesByProgram = _.groupBy(courses, 'program');
  const substageByProgram = _.groupBy(substages, 'program');
  const knowledgesByProgram = _.groupBy(knowledges, 'program');
  const subjectsByProgram = _.groupBy(subjects, 'program');
  const subjectTypesByProgram = _.groupBy(subjectTypes, 'program');
  const centersByProgram = _.groupBy(programCenter, 'program');
  const cyclesByProgram = _.groupBy(cycles, 'program');

  const treeTypes = await Promise.all(
    programs.map((program) => getProgramTreeTypes(program, { transacting }))
  );

  return programs.map((program, i) => ({
    ...program,
    image: imagesById ? imagesById[program.image] : program.image,
    treeTypeNodes: treeTypes[i],
    centers: centersByProgram[program.id] ? _.map(centersByProgram[program.id], 'center') : [],
    groups: groupsByProgram[program.id] ? groupsByProgram[program.id] : [],
    courses: coursesByProgram[program.id] ? _.orderBy(coursesByProgram[program.id], 'index') : [],
    knowledges: knowledgesByProgram[program.id] ? knowledgesByProgram[program.id] : [],
    subjects: subjectsByProgram[program.id] ? subjectsByProgram[program.id] : [],
    subjectTypes: subjectTypesByProgram[program.id] ? subjectTypesByProgram[program.id] : [],
    substages: substageByProgram[program.id]
      ? _.filter(substageByProgram[program.id], ({ number }) => _.isNil(number))
      : [],
    customSubstages: substageByProgram[program.id]
      ? _.filter(substageByProgram[program.id], ({ number }) => !_.isNil(number))
      : [],
    cycles: cyclesByProgram[program.id] ? cyclesByProgram[program.id] : [],
  }));
}

module.exports = { programsByIds };
