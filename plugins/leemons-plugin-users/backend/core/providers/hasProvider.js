/**
 *
 * @param {object} props
 * @param {import('@leemons/deployment-manager').Context} props.ctx
 * @returns {Promise<boolean>}
 */
async function hasProvider({ ctx }) {
  const provider = await ctx.tx.db.LoginProvider.findOne({}).select({ _id: 1 });

  return !!provider;
}

module.exports = hasProvider;
