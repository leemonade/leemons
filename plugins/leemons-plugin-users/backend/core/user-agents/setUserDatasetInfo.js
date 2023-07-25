async function setUserDatasetInfo({ userId, value, ctx }) {
  return ctx.tx.call('dataset.dataset.setValues', {
    locationName: 'user-data',
    pluginName: 'plugins.users',
    values: value,
    userAgent: ctx.userSession.userAgents,
    target: userId,
  });
}

module.exports = { setUserDatasetInfo };
