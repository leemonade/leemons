const { isEmpty } = require('lodash');
const { tables } = require('../../tables');
const { validateAddStatement } = require('../../../validations/forms');

async function add(
  { actor, verb, object, type, context, pluginName },
  { userSession, transacting: t }
) {
  return global.utils.withTransaction(
    async (transacting) => {
      console.log('this.calledFrom:', this.calledFrom);
      console.log('pluginName:', pluginName);

      if (![this.calledFrom, 'xapi'].includes(pluginName)) {
        throw new global.utils.HttpError(
          403,
          "Can't create an Statement for a plugin other than your own"
        );
      }

      await validateAddStatement({ actor, verb, object, type });

      const { services: userService } = leemons.getPlugin('users');
      const user = await userService.users.detail(actor);

      if (isEmpty(user)) {
        throw new global.utils.HttpError(400, 'User not found');
      }

      const statement = {
        actor: {
          objectType: 'Agent',
          name: [user.name, user.surnames, user.secondSurname]
            .filter((item) => !isEmpty(item))
            .join(' '),
          mbox: user.email,
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

      if (!isEmpty(userSession?.userAgents)) {
        const authority = await userService.users.detail(userSession.id);

        statement.authority = {
          mbox: authority.email,
          name: [authority.name, authority.surnames, authority.secondSurname]
            .filter((item) => !isEmpty(item))
            .join(' '),
          objectType: 'Agent',
        };
      }
      const result = await tables.statement.create(statement, { transacting });
      console.dir(result, { depth: null });
      return result;
    },
    tables.statement,
    t
  );
}

module.exports = { add };
