const _ = require('lodash');

async function byIds({ ids, ctx }) {
  const [sessions, assistances] = await Promise.all([
    ctx.tx.db.Session.find({ id: _.isArray(ids) ? ids : [ids] }).lean(),
    ctx.tx.db.Assistance.find({ session_: _.isArray(ids) ? ids : [ids] }).lean(),
  ]);
  const assistancesBySession = _.groupBy(assistances, 'session');
  return _.map(sessions, (session) => ({
    ...session,
    attendance: assistancesBySession[session.id],
  }));
}

module.exports = { byIds };
