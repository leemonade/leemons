const { LeemonsError } = require('@leemons/error');
const { createUserPool, createUserPoolClient } = require('../aws/userPool');
const enableMFA = require('../aws/userPool/mfa/enableMFA');

/**
 *
 * @param {object} props
 * @param {import('@leemons/deployment-manager').Context} props.ctx
 */
async function addUserPool({ ctx }) {
  const deploymentUserPool = await ctx.tx.db.UserPool.findOne({});

  if (deploymentUserPool) {
    throw new LeemonsError(ctx, {
      message: 'User pool already exists',
      httpStatusCode: 400,
    });
  }

  const userPool = await createUserPool({ ctx });
  const clientID = await createUserPoolClient({ userPoolId: userPool, ctx });

  await enableMFA({ userPoolId: userPool, ctx });

  await ctx.tx.db.UserPool.create({
    userPool,
    clientID,
  });

  return {
    userPool,
    clientID,
    identityProviders: [],
  };
}

module.exports = addUserPool;
