const { LeemonsError } = require('@leemons/error');

async function create({ ctx, ...data }) {
  try {
    const assignableObject = {
      role: 'task',
      ...data,
    };
    const createdAssignable = await ctx.tx.call('assignables.assignables.createAssignable', {
      assignable: assignableObject,
    });

    // TODO: Save attachments

    return ctx.tx.call('common.versionControl.parseId', {
      id: createdAssignable.id,
    });
  } catch (error) {
    throw new LeemonsError(ctx, { message: `Error creating task: ${error.message}` });
  }
}

module.exports = create;
