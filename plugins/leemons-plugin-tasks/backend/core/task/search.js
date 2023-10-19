const { LeemonsError } = require('@leemons/error');

async function searchTask({ draft, preferCurrent, search, subjects, sort, ctx, ...query }) {
  try {
    return await ctx.tx.call('assignables.assignables.searchAssignables', {
      roles: 'task',
      data: {
        published: !draft,
        preferCurrent,
        search,
        subjects,
        sort,
        ...query,
      },
    });
  } catch (e) {
    throw new LeemonsError(ctx, {
      message: `Error to search tasks: ${e.message}`,
    });
  }
}

module.exports = searchTask;
