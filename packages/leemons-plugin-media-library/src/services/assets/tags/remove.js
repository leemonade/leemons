const { assetTags } = require('../../tables');

module.exports = async function remove(asset, tags, { transacting } = {}) {
  const _tags = Array.isArray(tags) ? tags : [tags];

  try {
    const query = {
      asset,
    };

    if (tags.length) {
      query.tag_$in = _tags;
    }
    const deleted = await assetTags.deleteMany(query, { transacting });
    return {
      deleted: deleted.count,
      soft: deleted.soft,
    };
  } catch (e) {
    throw new Error(`Failed to delete tags: ${e.message}`);
  }
};
