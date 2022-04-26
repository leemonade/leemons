const leebrary = require('../leebrary');

module.exports = async function saveAsset(
  { cover, color, name, description, tags, category, indexable, public: publ },
  { userSession, transacting } = {}
) {
  return leebrary.assets.add(
    {
      cover,
      color,
      name,
      description,
      tags,
      category,
      indexable,
      public: publ,
    },
    { published: false, userSession, transacting }
  );
};
