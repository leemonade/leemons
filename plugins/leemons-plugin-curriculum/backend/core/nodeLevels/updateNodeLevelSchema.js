async function updateNodeLevelSchema({ schemaData, ctx }) {
  await ctx.tx.call('dataset.dataset.updateSchema', {
    ...schemaData,
  });
}

module.exports = { updateNodeLevelSchema };
