const { getClientCached } = require('./awsClient');

module.exports = async function emitToAll({ eventName, eventData, ctx }) {
  const client = await getClientCached({ ctx });
  client.publish(
    `${ctx.meta.deploymentID}-leemons-general`,
    JSON.stringify({ eventName, eventData })
  );
};
