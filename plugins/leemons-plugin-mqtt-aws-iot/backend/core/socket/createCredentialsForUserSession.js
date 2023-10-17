const _ = require('lodash');
const { LeemonsError } = require('@leemons/error');
const { getRegion, getAccount } = require('./aws');
const { createCredentials } = require('./createCredentials');

async function createCredentialsForUserSession({ ctx }) {
  const { userSession } = ctx.meta;
  try {
    if (!userSession) throw new LeemonsError(ctx, { message: 'userSession is required' });
    const region = await getRegion({ ctx });
    const account = await getAccount({ ctx });

    const policy = {
      Version: '2012-10-17',
      Statement: [
        {
          Effect: 'Allow',
          Action: ['iot:Connect'],
          Resource: '*',
        },
        {
          Effect: 'Allow',
          Action: ['iot:Subscribe', 'iot:Receive'],
          Resource: [
            `arn:aws:iot:${region}:${account}:topic/${userSession.deploymentID}-leemons-general`,
            `arn:aws:iot:${region}:${account}:topicfilter/${userSession.deploymentID}-leemons-general`,
            `arn:aws:iot:${region}:${account}:topic/${userSession.deploymentID}-leemons-${userSession.id}`,
            `arn:aws:iot:${region}:${account}:topicfilter/${userSession.deploymentID}-leemons-${userSession.id}`,
          ],
        },
      ],
    };

    _.forEach(userSession.userAgents, (userAgent) => {
      policy.Statement[1].Resource.push(
        `arn:aws:iot:${region}:${account}:topic/${userSession.deploymentID}-leemons-${userAgent.id}`
      );
      policy.Statement[1].Resource.push(
        `arn:aws:iot:${region}:${account}:topicfilter/${userSession.deploymentID}-leemons-${userAgent.id}`
      );
    });

    const credentials = await createCredentials({ policy, ctx });
    credentials.topics = _.uniq(
      _.map(policy.Statement[1].Resource, (r) =>
        r
          .replace(`arn:aws:iot:${region}:${account}:topicfilter/`, '')
          .replace(`arn:aws:iot:${region}:${account}:topic/`, '')
      )
    );

    return credentials;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

module.exports = { createCredentialsForUserSession };
