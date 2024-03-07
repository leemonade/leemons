const { getClientCached } = require('./awsClient');

module.exports = async function emitToAll({ eventName, eventData, ctx }) {
  try {
    const client = await getClientCached({ ctx });
    client.publish(
      `${ctx.meta.deploymentID}-leemons-general`,
      JSON.stringify({ eventName, eventData })
    );
  } catch (e) {
    console.error('IOT Emit to all error', e);
  }
};
