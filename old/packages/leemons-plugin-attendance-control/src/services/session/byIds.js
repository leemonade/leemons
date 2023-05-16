const _ = require('lodash');
const { tables } = require('../tables');

async function byIds(ids, { transacting } = {}) {
  const [sessions, assistances] = await Promise.all([
    tables.session.find({ id_$in: _.isArray(ids) ? ids : [ids] }, { transacting }),
    tables.assistance.find({ session_$in: _.isArray(ids) ? ids : [ids] }, { transacting }),
  ]);
  const assistancesBySession = _.groupBy(assistances, 'session');
  return _.map(sessions, (session) => ({
    ...session,
    attendance: assistancesBySession[session.id],
  }));
}

module.exports = { byIds };
