const _ = require('lodash');
const { table } = require('../tables');

async function subjectByIds(ids, { userSession, transacting } = {}) {
  const subjects = await table.subjects.find(
    { id_$in: _.isArray(ids) ? ids : [ids] },
    { transacting }
  );

  const assetService = leemons.getPlugin('leebrary').services.assets;
  const [images, icons] = await Promise.all([
    assetService.getByIds(_.map(subjects, 'image'), {
      withFiles: true,
      userSession,
      transacting,
    }),
    assetService.getByIds(_.map(subjects, 'icon'), {
      withFiles: true,
      userSession,
      transacting,
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
