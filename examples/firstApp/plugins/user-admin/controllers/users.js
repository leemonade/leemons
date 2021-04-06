async function register(ctx) {
  const { name, email, password } = ctx.request.body;
  if (name && email && password) {
    try {
      const user = await leemons
        .query('plugins_user-admin::users')
        .create({ name, email, password });

      ctx.body = { msg: 'The user has been created', user };
    } catch (e) {
      ctx.body = { msg: `The user can't be created` };
    }
  } else {
    ctx.body = { msg: `You must provide a name, email and password` };
  }
}

async function publicInfo(ctx) {
  const { id } = ctx.request.params;
  const user = await leemons
    .query('plugins_user-admin::users')
    .findOne({ id }, { columns: ['id', 'name'] });

  if (user) {
    ctx.body = { msg: 'The user has been found', user };
  } else {
    ctx.body = { msg: `The user can't be find` };
  }
}

async function allUsers(ctx) {
  const users = await leemons
    .query('plugins_user-admin::users')
    .find({}, { columns: ['name', 'id'] });
  if (users.length) {
    ctx.body = { msg: 'All the user info has been sent', users };
  } else {
    ctx.body = { msg: `We currently don't have users registered` };
  }
}

async function login(ctx) {
  const { email, password } = ctx.request.body;

  if (email && password) {
    const user = await leemons.query('plugins_user-admin::users').findOne({ email, password });
    if (user) {
      ctx.body = { msg: 'You have logged', user };
    } else {
      ctx.body = { msg: `The user can't be found` };
    }
  } else {
    ctx.body = { msg: `You must provide an email and password` };
  }
}

module.exports = {
  register,
  publicInfo,
  allUsers,
  login,
};
