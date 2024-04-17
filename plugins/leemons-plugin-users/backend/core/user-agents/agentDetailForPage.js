async function agentDetailForPage({ userAgentId, ctx }) {
  const [[tags], userAgent] = await Promise.all([
    ctx.tx.call('common.tags.getValuesTags', {
      values: userAgentId,
      type: 'users.user-agent',
    }),
    ctx.tx.db.UserAgent.findOne({ id: userAgentId }).lean(),
  ]);

  return { tags, user: userAgent.user };
}

module.exports = { agentDetailForPage };
