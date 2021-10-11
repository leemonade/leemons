const get = require('./get');

module.exports = async function getAllParents(
  id,
  { userSession, locale = null, transacting, deep = 0 } = {}
) {
  if (deep > 100) throw new Error('Detected infinity loop in getAllParents');

  const level = await get(id, { userSession, locale, transacting });

  let result = [level];

  let parent = null;
  if (level.parent) {
    parent = await getAllParents(level.parent, {
      userSession,
      locale,
      transacting,
      deep: deep + 1,
    });
    result = result.concat(parent);
  }

  return result;
};
