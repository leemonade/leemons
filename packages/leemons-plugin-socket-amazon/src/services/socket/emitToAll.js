const { getClientCached } = require('./awsClient');

module.exports = async function emitToAll(eventName, eventData) {
  const client = await getClientCached();
  client.publish(`leemons-general`, JSON.stringify({ eventName, eventData }));
};
