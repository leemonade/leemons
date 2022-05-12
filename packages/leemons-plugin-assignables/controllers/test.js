const test = require('../services/test');

module.exports = {
  test: async (ctx) => {
    try {
      await test(ctx.state.userSession);
    } catch (e) {
      console.log(e);
    }

    ctx.body = 'Hello World!';
  },
};
