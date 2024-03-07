const { stringifyId } = require('../helpers');
const { stringifyType } = require('../helpers/type');
const createVersion = require('../versions/createVersion');

module.exports = async function create({ type, setAsCurrent = false, published = false, ctx }) {
  const stringifiedType = stringifyType({ calledFrom: ctx.callerPlugin, type, ctx });

  const obj = {
    published: published && setAsCurrent ? '1.0.0' : null,
    type: stringifiedType,
  };

  let versionedEntity = await ctx.tx.db.CurrentVersions.create(obj);
  versionedEntity = versionedEntity.toObject();

  await createVersion({ id: versionedEntity.id, version: '1.0.0', published, ctx });

  return {
    uuid: versionedEntity.id,
    currentPublished: versionedEntity.published,
    fullId: stringifyId({ id: versionedEntity.id, version: '1.0.0', ctx }),
  };
};
