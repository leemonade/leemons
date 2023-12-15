const _ = require('lodash');
const { getClientCached } = require('./awsClient');

module.exports = async function emit({ ids, eventName, eventData, ctx }) {
  try {
    const client = await getClientCached({ ctx });
    const _ids = _.isArray(ids) ? ids : [ids];
    _.forEach(_ids, (id) => {
      client.publish(
        `${ctx.meta.deploymentID}-leemons-${id}`,
        JSON.stringify({ eventName, eventData })
      );
    });
  } catch (e) {
    console.error('IOT Emit error', eventName, e);
  }
};
