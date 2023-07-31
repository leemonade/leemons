const _ = require('lodash');

async function subjectByIds({ ids, ctx }) {
  const subjects = await ctx.tx.db.Subjects.find({ id: _.isArray(ids) ? ids : [ids] }).lean();

  const [images, icons] = await Promise.all([
    ctx.tx.call('leebrary.assets.getByIds', {
      assetsIds: _.map(subjects, 'image'),
      withFiles: true,
    }),
    ctx.tx.call('leebrary.assets.getByIds', {
      assetsIds: _.map(subjects, 'icon'),
      withFiles: true,
    }),
  ]);

  const imagesById = _.keyBy(images, 'id');
  const iconsById = _.keyBy(icons, 'id');

  return _.map(subjects, (subject) => ({
    ...subject,
    image: imagesById[subject.image],
    icon: iconsById[subject.icon],
  }));
}

module.exports = { subjectByIds };
