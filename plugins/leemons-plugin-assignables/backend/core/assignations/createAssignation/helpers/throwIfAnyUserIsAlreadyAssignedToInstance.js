const { LeemonsError } = require('@leemons/error');

async function throwIfAnyUserIsAlreadyAssignedToInstance({ users, instance, ctx }) {
  const assignations = await ctx.tx.db.Assignations.find({
    instance,
    user: users,
  })
    .select({ user: 1, _id: 0 })
    .lean();

  if (assignations.length > 0) {
    throw new LeemonsError(ctx, {
      message: `Some of the users are already assigned to instance ${instance}`,
    });
  }
}

module.exports = { throwIfAnyUserIsAlreadyAssignedToInstance };
