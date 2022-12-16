const _ = require('lodash');
const { add } = require('../src/services/xapi/statement/add');

async function addStatement(ctx) {
  const { type } = ctx.request.body;
  if (type === 'learning' || type === 'log') {
    let actor = ctx.state.userSession.userAgents[0].id;
    if (ctx.state.userSession.userAgents.length > 1) {
      actor = _.map(ctx.state.userSession.userAgents, 'id');
    }

    await add(
      { ...ctx.request.body, actor },
      {
        ip: ctx.request.ip,
        userSession: ctx.state.userSession,
      }
    );
    ctx.status = 200;
    ctx.body = { status: 200 };
  } else {
    throw new Error('Only type (learning | log) are available');
  }
}

module.exports = {
  addStatement,
};
