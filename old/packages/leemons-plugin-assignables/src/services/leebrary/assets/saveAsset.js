const leebrary = require('../leebrary');

module.exports = async function saveAsset(
  {
    cover,
    color,
    name,
    tagline,
    description,
    tags,
    category,
    indexable,
    program,
    subjects,
    public: publ,
  },
  { userSession, transacting, published } = {}
) {
  return leebrary().assets.add(
    {
      cover,
      color,
      name,
      tagline,
      description,
      tags,
      category,
      indexable,
      public: publ,
      program,
      subjects,
    },
    { published, userSession, transacting }
  );
};
