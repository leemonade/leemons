const { LeemonsError } = require('@leemons/error');

const { getUserFullName } = require('../../../../../packages/leemons-users/src');

const { generateJWTToken } = require('./jwt/generateJWTToken');

async function addXapiStatement({ user, ctx }) {
  await ctx.tx.call('xapi.xapi.addLogStatement', {
    statement: {
      actor: ctx.meta.userSession.userAgents[0].id,
      verb: {
        id: 'https://adlnet.gov/expapi/verbs/impersonated',
        display: {
          'en-US': 'impersonated',
        },
      },
      object: {
        objectType: 'Agent',
        name: getUserFullName({ userSession: user }),
        mbox: `mailto:${user.email}`,
        openid: `${ctx.meta.hostname}/api/users/users/${user.id}/detail/page`,
        account: {
          homePage: ctx.meta.hostname,
          name: user.id,
        },
      },
    },
  });
}

async function impersonateUser({ id, ctx }) {
  const user = await ctx.tx.db.Users.findOne({ id }).lean();

  if (!user) {
    throw new LeemonsError(ctx, {
      message: 'User not found',
      customCode: 'USER_NOT_FOUND',
      httpStatusCode: 404,
    });
  }

  await addXapiStatement({ user, ctx });

  return await generateJWTToken({ payload: { id: user.id }, ctx });
}

module.exports = { impersonateUser };
