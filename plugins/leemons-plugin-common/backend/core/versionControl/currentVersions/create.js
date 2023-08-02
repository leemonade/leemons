// const {
//   table: { currentVersions },
// } = require('../../tables');
const { stringifyId } = require('../helpers');
const { stringifyType } = require('../helpers/type');
const createVersion = require('../versions/createVersion');

module.exports = async function create({ type, setAsCurrent = false, published = false, ctx }) {
  const stringifiedType = stringifyType(ctx.callerPlugin, type);

  const obj = {
    published: published && setAsCurrent ? '1.0.0' : null,
    type: stringifiedType,
  };

  const versionedEntity = await ctx.tx.db.CurrentVersions.create(obj);

  // await createVersion.bind(this)(versionedEntity.id, {
  //   version: '1.0.0',
  //   published,
  // });

  await createVersion(versionedEntity.id, {
    version: '1.0.0',
    published,
  });

  return {
    uuid: versionedEntity.id,
    currentPublished: versionedEntity.published,
    fullId: stringifyId(versionedEntity.id, '1.0.0'),
  };
};
