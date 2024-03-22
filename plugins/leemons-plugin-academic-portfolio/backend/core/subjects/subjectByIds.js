const _ = require('lodash');
// const { classByIds } = require('../classes/classByIds');

// Todo: Make this function subject details.
async function subjectByIds({ ids, withClasses = false, ctx }) {
  const [subjects, creditsAndInternalId, classes] = await Promise.all([
    ctx.tx.db.Subjects.find({ id: _.isArray(ids) ? ids : [ids] }).lean(),
    ctx.tx.db.ProgramSubjectsCredits.find({ subject: ids }).lean(),
    ctx.tx.db.Class.find({ subject: _.isArray(ids) ? ids : [ids] })
      .select(['id', 'color'])
      .lean(),
  ]);

  // const classesBySubject = _.groupBy(classes, 'subject');

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

  let finalSubjects = _.map(subjects, (subject) => ({
    ...subject,
    credits: creditsAndInternalId.find((item) => item.subject === subject.id).credits,
    internalId: creditsAndInternalId.find((item) => item.subject === subject.id).internalId,
    course: subject.course ? JSON.parse(subject.course) : null,
    //OLD color: classesBySubject[subject.id]?.[0]?.color,
    color: subject.color,
    image: imagesById[subject.image],
    icon: iconsById[subject.icon],
  }));

  // if (withClasses) {
  //   const detailedClasses = await classByIds({ ids: classes.map((item) => item.id), ctx });
  //   const classesBySubject = _.groupBy(detailedClasses, (item) => item.subject.id);
  //   finalSubjects = _.map(finalSubjects, (subject) => ({
  //     ...subject,
  //     classes: classesBySubject[subject.id] ? classesBySubject[subject.id] : [],
  //   }));
  // }

  return finalSubjects;
}

module.exports = { subjectByIds };
