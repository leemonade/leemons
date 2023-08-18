const _ = require('lodash');
const { getClientCached } = require('./awsClient');

module.exports = async function emit(ids, eventName, eventData) {
  const client = await getClientCached();
  const _ids = _.isArray(ids) ? ids : [ids];
  _.forEach(_ids, (id) => {
    client.publish(`leemons-${id}`, JSON.stringify({ eventName, eventData }));
  });
};
