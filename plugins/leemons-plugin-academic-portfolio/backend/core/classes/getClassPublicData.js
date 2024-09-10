const { pick } = require('lodash');

const { classByIds } = require('./classByIds');

async function getClassPublicData({ ctx, ids }) {
  const classesData = await classByIds({ ids, withProgram: true, ctx });

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
    },
    subject: { name: cls.subject?.name, id: cls.subject?.id },
    teachers: cls.teachers,
  }));

  return Array.isArray(ids) ? results : results[0];
}

module.exports = {
  getClassPublicData,
};
