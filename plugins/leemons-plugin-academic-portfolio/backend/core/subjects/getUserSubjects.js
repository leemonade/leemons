const { keyBy, map } = require('lodash');

const { getUserSubjectIds } = require('./getUserSubjectIds');

async function getUserSubjects({ teacherTypeFilter, ctx }) {
  const subjectIds = await getUserSubjectIds({ ctx, teacherTypeFilter });
  const subjects = await ctx.tx.db.Subjects.find({ id: subjectIds }).lean();

  const images = await ctx.tx.call('leebrary.assets.getByIds', {
    ids: map(subjects, 'image'),
    withFiles: true,
  });

  const imagesById = keyBy(images, 'id');

  return subjects.map((subject) => ({
    ...subject,
    courses: subject.course ? JSON.parse(subject.course) : [],
    image: imagesById[subject.image],
  }));
}

module.exports = { getUserSubjects };
