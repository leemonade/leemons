const _ = require('lodash');
const { tables } = require('../../tables');
const { validateAddStatement } = require('../../../validations/forms');

// actor : Id user agent
// verb : consultar / consumir /
async function add({ actor, verb, object, context, pluginName }, { userSession, transacting: t }) {
  const { services: userService } = leemons.getPlugin('users');
  if (![this.calledFrom, 'xapi'].includes(pluginName)) {
    throw new global.utils.HttpError(
      403,
      "Can't create an Statement for a plugin other than your own"
    );
  }

  await validateAddStatement({ actor, verb, object });

  const promises = [
    userService.users.getUserAgentsInfo([actor]),
    userService.platform.getHostname(),
  ];

  if (!_.isEmpty(userSession?.userAgents)) {
    promises.push(userService.users.detail(userSession.id));

    statement.authority = {
      mbox: authority.email,
      name: [authority.name, authority.surnames, authority.secondSurname]
        .filter((item) => !isEmpty(item))
        .join(' '),
      objectType: 'Agent',
    };
  }

  const [[userAgent], hostname] = await Promise.all(promises);

  if (_.isEmpty(userAgent)) {
    throw new global.utils.HttpError(400, 'User not found');
  }

  const statement = {
    actor: {
      objectType: 'Agent',
      name: [userAgent.user.name, userAgent.user.surnames, userAgent.user.secondSurname]
        .filter((item) => !_.isEmpty(item))
        .join(' '),
      mbox: userAgent.user.email,
      openid: `${hostname}/api/users/user-agent/${userAgent.id}/detail/page`,
      account: {
        homePage: hostname,
        name: userAgent.id,
      },
    },
    verb: {
      id: `http://localhost/xapi/verbs/${verb}`,
      display: {
        'en-US': verb,
      },
    },
    object: {
      objectType: 'Activity',
      id: `http://localhost/${pluginName}/${object}`,
      definition: {
        name: {
          'en-US': object,
        },
      },
    },
    context,
    version: '1.0.0',
  };

  const result = await tables.statement.create(statement);
  console.dir(result, { depth: null });
  return result;
}

module.exports = { add };
