const get = require('./get');
const { permissions } = require('../tables');

module.exports = async function list(asset, { userSession, transacting } = {}) {
  try {
    const { role } = await get(asset, { userSession, transacting });

    if (role) {
      const entries = await permissions.find(
        {
          asset,
        },
        { transacting }
      );

      return entries.map(({ role: r, userAgent: u }) => ({ role: r, userAgent: u }));
    }

    throw new Error("You don't have permission to list users");
  } catch (e) {
    throw new Error(`Failed to get permissions: ${e.message}`);
  }
};
