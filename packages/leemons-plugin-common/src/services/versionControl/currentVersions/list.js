const {
  table: { currentVersions },
} = require('../../tables');
const stringifyType = require('../helpers/type/stringifyType');
const verifyOwnership = require('../helpers/type/verifyOwnership');

module.exports = async function list(type, { published, transacting }) {
  const parsedType = stringifyType(this.calledFrom, type);

  if (!verifyOwnership(parsedType, this)) {
    throw new Error(
      "You don't have permissions to list versions of the given type or it doesn't exists"
    );
  }

  const query = {
    type: parsedType,
  };

  if (typeof published === 'boolean') {
    query.published_$null = !published;
  }

  const results = await currentVersions.find(query, { transacting });

  return results.map((r) => ({
    uuid: r.id,
    current: r.published,
    type: r.type,
  }));
};
