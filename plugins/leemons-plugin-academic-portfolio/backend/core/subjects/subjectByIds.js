const _ = require('lodash');

// Todo: Make this function subject details.
async function subjectByIds({ ids, withClasses = false, showArchived, ctx }) {
  const queryOptions = showArchived ? { excludeDeleted: false } : {};
  const [subjects, creditsAndInternalId, classes] = await Promise.all([
    ctx.tx.db.Subjects.find({ id: _.isArray(ids) ? ids : [ids] }, '', queryOptions).lean(),
    ctx.tx.db.ProgramSubjectsCredits.find({ subject: ids }, '', queryOptions).lean(),
    ctx.tx.db.Class.find({ subject: _.isArray(ids) ? ids : [ids] }, '', queryOptions)
      .select(['id', 'subject', 'subjectType'])
      .lean(),
  ]);

  const [images, icons] = await Promise.all([
    ctx.tx.call('leebrary.assets.getByIds', {
      ids: _.map(subjects, 'image'),
      withFiles: true,
    }),
    ctx.tx.call('leebrary.assets.getByIds', {
      ids: _.map(subjects, 'icon'),
      withFiles: true,
    }),
  ]);
  const imagesById = _.keyBy(images, 'id');
  const iconsById = _.keyBy(icons, 'id');

  const classesIdsBySubject = _.groupBy(classes, 'subject');
  const subjectTypesBySubject = _.mapValues(classesIdsBySubject, (classGroup) => {
    const uniqueSubjectTypes = _.uniq(_.map(classGroup, 'subjectType'));
    return uniqueSubjectTypes.length === 1 ? uniqueSubjectTypes[0] : 'various';
  });

  let finalSubjects = _.map(subjects, (subject) => ({
    ...subject,
    credits: creditsAndInternalId.find((item) => item.subject === subject.id)?.credits || null,
    internalId:
      creditsAndInternalId.find((item) => item.subject === subject.id)?.internalId || null,
    course: subject.course ? JSON.parse(subject.course) : null, // Old, left there just in case. A subject can have multiple courses
    courses: subject.course ? JSON.parse(subject.course) : [],
    // OLD color: classesBySubject[subject.id]?.[0]?.color,
    color: subject.color,
    image: imagesById[subject.image],
    icon: iconsById[subject.icon],
    subjectType: subjectTypesBySubject[subject.id],
  }));

  if (withClasses) {
    const detailedClasses = await ctx.tx.call('academic-portfolio.classes.classByIds', {
      ids: classes.map((item) => item.id),
      showArchived,
    });
    const classesBySubject = _.groupBy(detailedClasses, (item) => item.subject.id);
    finalSubjects = _.map(finalSubjects, (subject) => ({
      ...subject,
      classes: classesBySubject[subject.id] ? classesBySubject[subject.id] : [],
    }));
  }

  return finalSubjects;
}

module.exports = { subjectByIds };
