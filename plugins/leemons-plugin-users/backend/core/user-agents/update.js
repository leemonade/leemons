async function update({ userAgentId, tags, ctx }) {
  const promises = [];
  if (tags)
    promises.push(
      ctx.tx.call('common.tags.setTagsToValues', {
        type: 'plugins.users.user-agent',
        tags,
        values: userAgentId,
      })
    );
  await Promise.all(promises);
  return true;
}

module.exports = { update };
