const _ = require('lodash');

const { listClasses } = require('../classes/listClasses');
const { getClassesProgramInfo } = require('../classes/listSessionClasses');

const { getProgramCourses } = require('./getProgramCourses');
const { getProgramCustomNomenclature } = require('./getProgramCustomNomenclature');
const { getProgramCycles } = require('./getProgramCycles');
const { getProgramGroups } = require('./getProgramGroups');
const { organizeProgramStaffByRoles, getProgramStaffMany } = require('./getProgramStaff');
const { getProgramSubjects } = require('./getProgramSubjects');
const { getProgramSubstages } = require('./getProgramSubstages');
const { getProgramTreeTypes } = require('./getProgramTreeTypes');

// In order to know hwat knowledge areas or subject types are being used by the program subjects,
// we cannot check the program anymore. We search for this information in the class
const getUsedKnowledgeAreas = (classes) => {
  if (!classes) return [];
  return _.uniqBy(_.compact(_.flatMap(classes, 'knowledges')), 'id');
};

const getUsedSubjectTypes = (classes) => {
  if (!classes) return [];
  return _.uniq(_.compact(classes.map((classItem) => classItem.subjectType)));
};

const getProgramStudents = (classes) => {
  if (!classes) return [];
  const studentIds = classes.reduce((acc, curr) => {
    if (curr.students?.length) {
      acc.push(...curr.students);
    }
    return acc;
  }, []);

  return [...new Set(studentIds)];
};

const getProgramTeachers = (classes) => {
  if (!classes) return [];
  const teacherIds = classes.reduce((acc, curr) => {
    if (curr.teachers?.length) {
      acc.push(...curr.teachers);
    }
    return acc;
  }, []);

  return [...new Set(teacherIds)];
};

async function programsByIds({
  ids,
  onlyProgram,
  withStudentsAndTeachers = false,
  withClasses = false,
  showArchived,
  shouldPrepareAssets,
  ctx,
}) {
  const dbQueryOptions = showArchived ? { excludeDeleted: false } : {};
  const { userSession } = ctx.meta;
  if (onlyProgram) {
    return ctx.tx.db.Programs.find({ id: _.isArray(ids) ? ids : [ids] }, '', dbQueryOptions).lean();
  }

  const [
    programs,
    programCenter,
    substages,
    courses,
    groups,
    subjects,
    cycles,
    nomenclature,
    staff,
  ] = await Promise.all([
    ctx.tx.db.Programs.find({ id: _.isArray(ids) ? ids : [ids] }, '', dbQueryOptions).lean(),
    ctx.tx.db.ProgramCenter.find({ program: _.isArray(ids) ? ids : [ids] }, dbQueryOptions).lean(),
    getProgramSubstages({ ids, options: dbQueryOptions, ctx }),
    getProgramCourses({ ids, options: dbQueryOptions, ctx }),
    getProgramGroups({ ids, options: dbQueryOptions, ctx }),
    getProgramSubjects({ ids, options: dbQueryOptions, ctx }),
    getProgramCycles({ ids, ctx }),
    getProgramCustomNomenclature({ ids, ctx }),
    getProgramStaffMany({ ids, ctx }),
  ]);

  // We need the program classes to get extra info: knowledge areas, subject types, students
  let classes;
  const { items: _classes } = await listClasses({
    page: 0,
    size: 99999,
    program: undefined,
    query: { program: ids },
    options: dbQueryOptions,
    ctx,
  });

  if (ids?.length) {
    classes = await getClassesProgramInfo({
      programs: ids,
      classes: _classes,
      ctx,
    });
  }

  let imagesById = null;
  if (userSession) {
    const images = await ctx.tx.call('leebrary.assets.getByIds', {
      ids: _.map(programs, 'image'),
      withFiles: true,
      shouldPrepareAssets,
    });
    imagesById = _.keyBy(images, 'id');
  }

  const groupsByProgram = _.groupBy(groups, 'program');
  const coursesByProgram = _.groupBy(courses, 'program');
  const substageByProgram = _.groupBy(substages, 'program');
  const subjectsByProgram = _.groupBy(subjects, 'program');
  const centersByProgram = _.groupBy(programCenter, 'program');
  const cyclesByProgram = _.groupBy(cycles, 'program');
  const classesByProgramId = _.groupBy(classes, 'program');
  const staffByProgram = _.groupBy(staff, 'program');

  const treeTypes = await Promise.all(
    programs.map((program) => getProgramTreeTypes({ programId: program, ctx }))
  );

  let finalPrograms = programs.map((program, i) => ({
    ...program,
    hasKnowledgeAreas: program.haveKnowledge,
    image: imagesById ? imagesById[program.image] : program.image,
    treeTypeNodes: treeTypes[i],
    centers: centersByProgram[program.id] ? _.map(centersByProgram[program.id], 'center') : [],
    groups: groupsByProgram[program.id] ? groupsByProgram[program.id] : [],
    courses: coursesByProgram[program.id] ? _.orderBy(coursesByProgram[program.id], 'index') : [],
    knowledgeAreas: getUsedKnowledgeAreas(classesByProgramId[program.id] || []),
    subjects: subjectsByProgram[program.id] ? subjectsByProgram[program.id] : [],
    subjectTypes: getUsedSubjectTypes(classesByProgramId[program.id] || []),
    substages: substageByProgram[program.id]
      ? _.filter(substageByProgram[program.id], ({ number }) => _.isNil(number))
      : [],
    customSubstages: substageByProgram[program.id]
      ? _.filter(substageByProgram[program.id], ({ number }) => !_.isNil(number))
      : [],
    cycles: cyclesByProgram[program.id] ? cyclesByProgram[program.id] : [],
    nomenclature: nomenclature[program.id] ? nomenclature[program.id] : {},
    staff: staffByProgram[program.id]
      ? organizeProgramStaffByRoles(staffByProgram[program.id])
      : {},
  }));

  if (withStudentsAndTeachers) {
    finalPrograms = finalPrograms.map((program) => ({
      ...program,
      students: getProgramStudents(classesByProgramId[program.id]),
      teachers: getProgramTeachers(classesByProgramId[program.id]),
    }));
  }

  if (withClasses) {
    finalPrograms = finalPrograms.map((program) => ({
      ...program,
      classes: classesByProgramId[program.id] || [],
    }));
  }

  return finalPrograms;
}

module.exports = { programsByIds };
