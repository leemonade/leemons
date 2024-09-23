const { pick } = require('lodash');

const { getProgramCustomNomenclature } = require('../programs');

const { classByIds } = require('./classByIds');

async function getClassPublicData({ ctx, ids }) {
  const classesData = await classByIds({ ids, withProgram: true, ctx });
  const nomenclature = await getProgramCustomNomenclature({
    ids: classesData.map((cls) => cls.program?.id),
    ctx,
  });

  const results = classesData.map((cls) => ({
    id: cls.id,
    alias: cls.alias,
    classroomId: cls.classroomId,
    classWithoutGroupId: cls.classWithoutGroupId,
    groupAbreviation: cls.groups?.abbreviation ?? null,
    courses: Array.isArray(cls.courses)
      ? cls.courses.map(({ id, index }) => ({ id, index }))
      : [pick(cls.courses, ['id', 'index'])],
    program: {
      name: cls.program?.name,
      id: cls.program?.id,
      maxNumberOfCourses: cls.program?.maxNumberOfCourses,
      nomenclature: nomenclature[cls.program?.id], // Returns nomenclature in the user locale
    },
    subject: {
      name: cls.subject?.name,
      id: cls.subject?.id,
      useBlocks: cls.subject?.useBlocks,
      color: cls.subject?.color,
      icon: cls.subject?.icon,
    },
    teachers: cls.teachers,
    studentsCount: cls.students?.length,
  }));

  return Array.isArray(ids) ? results : results[0];
}

module.exports = {
  getClassPublicData,
};
