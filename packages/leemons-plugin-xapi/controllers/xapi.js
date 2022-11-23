const { add } = require('../src/services/xapi/statement/add');

async function addStatement(ctx) {
  const { type } = ctx.request.body;
  if (type === 'learning' || type === 'log') {
    await add(ctx.request.body, { userSession: ctx.state.userSession });
  }
  throw new Error('Only type (learning | log) are available');
}

module.exports = {
  addStatement,
};
