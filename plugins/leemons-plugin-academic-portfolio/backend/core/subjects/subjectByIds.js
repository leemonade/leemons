const _ = require('lodash');

async function subjectByIds({ ids, ctx }) {
  const [subjects, classes] = await Promise.all([
    ctx.tx.db.Subjects.find({ id: _.isArray(ids) ? ids : [ids] }).lean(),
    ctx.tx.db.Class.find({ subject: _.isArray(ids) ? ids : [ids] })
      .select(['color', 'subject'])
      .lean(),
  ]);

  const classesBySubject = _.groupBy(classes, 'subject');

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

  return _.map(subjects, (subject) => ({
    ...subject,
    color: classesBySubject[subject.id]?.[0]?.color,
    image: imagesById[subject.image],
    icon: iconsById[subject.icon],
  }));
}

module.exports = { subjectByIds };
