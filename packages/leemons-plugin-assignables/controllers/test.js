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
  createUser: async () => {
    console.log(
      await leemons.getPlugin('users').services.users.add({
        name: 'Miguel',
        surnames: 'Florido',
        email: 'teacher@leemons.io',
        locale: 'es',
        password: 'testing',
      })
    );
  },
};
