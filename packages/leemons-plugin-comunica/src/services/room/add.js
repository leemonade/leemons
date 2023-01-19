const _ = require('lodash');
const { table } = require('../tables');
const { validateKeyPrefix, validateExistRoomKey } = require('../../validations/exists');
const { addUserAgents } = require('./addUserAgents');

async function add(
  key,
  {
    name,
    type,
    initDate,
    subName,
    bgColor,
    nameReplaces,
    icon,
    image,
    userAgents = [],
    parentRoom,
    useEncrypt = true,
    viewPermissions,
    transacting: _transacting,
  } = {}
) {
  validateKeyPrefix(key, this.calledFrom);

  return global.utils.withTransaction(
    async (transacting) => {
      await validateExistRoomKey(key, { transacting });

      const room = await table.room.create(
        {
          key,
          name,
          type,
          nameReplaces,
          initDate,
          bgColor,
          subName,
          icon,
          image,
          parentRoom,
          useEncrypt,
        },
        { transacting }
      );

      if (viewPermissions) {
        await leemons
          .getPlugin('users')
          .services.permissions.addItem(key, 'plugins.comunica.room.view', viewPermissions, {
            isCustomPermission: true,
            transacting,
          });
      }

      if (userAgents.length > 0) {
        await addUserAgents.call(this, room.key, userAgents, { transacting });
      }
    },
    table.room,
    _transacting
  );
}

module.exports = { add };
