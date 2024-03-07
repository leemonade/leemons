const _ = require('lodash');
const { getProgramSubjectTypes } = require('./getProgramSubjectTypes');
const { getProgramSubjects } = require('./getProgramSubjects');
const { getProgramKnowledges } = require('./getProgramKnowledges');
const { getProgramGroups } = require('./getProgramGroups');
const { getProgramCourses } = require('./getProgramCourses');
const { getProgramSubstages } = require('./getProgramSubstages');
const { getProgramTreeTypes } = require('./getProgramTreeTypes');
const { getProgramCycles } = require('./getProgramCycles');
const { listClasses } = require('../classes/listClasses');
const { getClassesProgramInfo } = require('../classes/listSessionClasses');

async function programsByIds({ ids, onlyProgram, withClasses = false, ctx }) {
  const { userSession } = ctx.meta;
  if (onlyProgram) {
    return ctx.tx.db.Programs.find({ id: _.isArray(ids) ? ids : [ids] }).lean();
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
    ctx.tx.db.Programs.find({ id: _.isArray(ids) ? ids : [ids] }).lean(),
    ctx.tx.db.ProgramCenter.find({ program: _.isArray(ids) ? ids : [ids] }).lean(),
    getProgramSubstages({ ids, ctx }),
    getProgramCourses({ ids, ctx }),
    getProgramGroups({ ids, ctx }),
    getProgramKnowledges({ ids, ctx }),
    getProgramSubjects({ ids, ctx }),
    getProgramSubjectTypes({ ids, ctx }),
    getProgramCycles({ ids, ctx }),
  ]);

  let classes;
  if (withClasses) {
    const { items: _classes } = await listClasses({
      page: 0,
      size: 99999,
      program: undefined,
      query: { program: ids },
      ctx,
    });

    if (ids?.length) {
      classes = await getClassesProgramInfo({
        programs: ids,
        classes: _classes,
        ctx,
      });
    }
  }

  let imagesById = null;
  if (userSession) {
    const images = await ctx.tx.call('leebrary.assets.getByIds', {
      ids: _.map(programs, 'image'),
      withFiles: true,
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
    programs.map((program) => getProgramTreeTypes({ programId: program, ctx }))
  );

  return programs.map((program, i) => ({
    ...program,
    image: imagesById ? imagesById[program.image] : program.image,
    treeTypeNodes: treeTypes[i],
    classes,
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
