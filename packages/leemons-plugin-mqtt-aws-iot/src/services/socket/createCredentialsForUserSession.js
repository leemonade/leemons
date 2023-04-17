const _ = require('lodash');
const { getRegion, getAccount } = require('./aws');
const { createCredentials } = require('./createCredentials');

async function createCredentialsForUserSession(userSession) {
  try {
    if (!userSession) throw new Error('userSession is required');
    const region = await getRegion();
    const account = await getAccount();

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
            `arn:aws:iot:${region}:${account}:topic/leemons-general`,
            `arn:aws:iot:${region}:${account}:topicfilter/leemons-general`,
            `arn:aws:iot:${region}:${account}:topic/leemons-${userSession.id}`,
            `arn:aws:iot:${region}:${account}:topicfilter/leemons-${userSession.id}`,
          ],
        },
      ],
    };

    _.forEach(userSession.userAgents, (userAgent) => {
      policy.Statement[1].Resource.push(
        `arn:aws:iot:${region}:${account}:topic/leemons-${userAgent.id}`
      );
      policy.Statement[1].Resource.push(
        `arn:aws:iot:${region}:${account}:topicfilter/leemons-${userAgent.id}`
      );
    });

    const credentials = await createCredentials(policy);
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
