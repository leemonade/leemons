const { getProvider } = require('../getProvider');

/**
 * @typedef {object} User
 * @property {string} id
 * @property {string} email
 * @property {string | undefined} password
 */

/**
 *
 * @param {object} props
 * @param {User} props.user
 * @param {import('@leemons/deployment-manager').Context} props.ctx
 * @returns {Promise<void>}
 */
async function addUser({ user, ctx }) {
  const provider = await getProvider({ ctx });

  if (!provider?.supportedMethods?.users?.addUser) {
    return;
  }

  await ctx.tx.call(`${provider.pluginName}.users.addUser`, {
    user,
  });
}

module.exports = addUser;
