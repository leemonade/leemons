async function updateNodeLevelSchema(schemaData, { transacting }) {
  await leemons.getPlugin('dataset').services.dataset.updateSchema(schemaData, {
    transacting,
  });
}

module.exports = { updateNodeLevelSchema };
