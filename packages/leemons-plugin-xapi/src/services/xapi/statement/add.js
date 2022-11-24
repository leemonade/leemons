const _ = require('lodash');
const { tables } = require('../../tables');
const { validateAddStatement } = require('../../../validations/forms');

function getUserAgentActor(userAgent, hostname) {
  return {
    objectType: 'Agent',
    name: [userAgent.user.name, userAgent.user.surnames, userAgent.user.secondSurname]
      .filter((item) => !_.isEmpty(item))
      .join(' '),
    mbox: `mailto:${userAgent.user.email}`,
    openid: `${hostname}/api/users/user-agent/${userAgent.id}/detail/page`,
    account: {
      homePage: hostname,
      name: userAgent.id,
    },
  };
}

/**
 * Create one statement of xapi
 * Documentation: https://github.com/adlnet/xAPI-Spec/blob/master/xAPI-Data.md#timestamp
 * @public
 * @static
 * @param {string | string[]} actor - Id or ids of user agents
 * @param {object} verb - Verb provided by us (Action taken by the Actor.)
 * @param {object} object - (Activity, Agent, or another Statement that is the Object of the Statement)
 * @param {object} context - Context that gives the Statement more meaning. Examples: a team the Actor is working with, altitude at which a scenario was attempted in a flight simulator.
 * @param {object} result - Result Object, further details representing a measured outcome.
 * @param {object} attachments - Headers for Attachments to the Statement
 * @param {string} type - learning | log
 * @param {object} userSession - Leemons user session
 * @return {Promise<Permission>} Created permission
 * */
async function add(
  { actor, verb, object, context, result, attachments, type = 'learning' },
  { ip, userSession }
) {
  const { services: userService } = leemons.getPlugin('users');

  await validateAddStatement({ actor, verb, object });

  const isMultipleActors = _.isArray(actor);

  const promises = [
    userService.users.getUserAgentsInfo(isMultipleActors ? actor : [actor]),
    userService.platform.getHostname(),
  ];

  if (!_.isEmpty(userSession?.userAgents)) {
    promises.push(userService.users.detail(userSession.id));
  }

  const [userAgents, hostname, authority] = await Promise.all(promises);

  if (!userAgents.length) {
    throw new global.utils.HttpError(400, 'User not found');
  }

  let actorStatement = {};

  if (isMultipleActors) {
    actorStatement = {
      objectType: 'Group',
      member: _.map(userAgents, (userAgent) => getUserAgentActor(userAgent, hostname)),
    };
  } else {
    actorStatement = getUserAgentActor(userAgents[0], hostname);
  }

  const statement = {
    actor: actorStatement,
    verb,
    object: JSON.parse(
      JSON.stringify(object)
        .replace(/{hostname}/g, hostname)
        .replace(/{ip}/g, ip)
    ),
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  };

  if (context)
    statement.context = JSON.parse(
      JSON.stringify(context)
        .replace(/{hostname}/g, hostname)
        .replace(/{ip}/g, ip)
    );
  if (result)
    statement.result = JSON.parse(
      JSON.stringify(result)
        .replace(/{hostname}/g, hostname)
        .replace(/{ip}/g, ip)
    );
  if (attachments)
    statement.attachments = JSON.parse(
      JSON.stringify(attachments)
        .replace(/{hostname}/g, hostname)
        .replace(/{ip}/g, ip)
    );

  if (authority) {
    statement.authority = {
      mbox: `mailto:${authority.email}`,
      name: [authority.name, authority.surnames, authority.secondSurname]
        .filter((item) => !_.isEmpty(item))
        .join(' '),
      objectType: 'Agent',
    };
  }

  return tables.statement.create({ statement, type });
}

module.exports = { add };
