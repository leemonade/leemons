const get = require('./get');

module.exports = async function has(asset, permission, { userSession, transacting } = {}) {
  try {
    const current = Object.entries(await get(asset, { userSession, transacting }))
      .filter(([, value]) => value)
      .map(([key]) => key);

    return permission.every((p) => current.includes(p));
  } catch (e) {
    throw new Error(`Failed to get permissions: ${e.message}`);
  }
};
