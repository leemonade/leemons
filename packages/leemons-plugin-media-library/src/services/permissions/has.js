const get = require('./get');

module.exports = async function has(asset, permission, { userSession, transacting } = {}) {
  try {
    const current = await get(asset, { userSession, transacting });

    return permission.every((p) => current.includes(p));
  } catch (e) {
    throw new Error(`Failed to get permissions: ${e.message}`);
  }
};
