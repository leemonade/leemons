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
    nameReplaces = {},
    icon,
    image,
    metadata = {},
    userAgents = [],
    adminUserAgents = [],
    parentRoom,
    useEncrypt = true,
    viewPermissions,
    program,
    center: _center,
    transacting: _transacting,
  } = {}
) {
  validateKeyPrefix(key, this.calledFrom);

  return global.utils.withTransaction(
    async (transacting) => {
      await validateExistRoomKey(key, { transacting });

      let center = _center;

      if (program && !center) {
        [center] = await leemons
          .getPlugin('academic-portfolio')
          .services.programs.getProgramCenters(program, { transacting });
      }

      const room = await table.room.create(
        {
          key,
          name,
          type,
          nameReplaces: JSON.stringify(nameReplaces),
          initDate,
          bgColor,
          subName,
          icon,
          image,
          parentRoom,
          useEncrypt,
          program,
          center,
          metadata: JSON.stringify(metadata),
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
      if (adminUserAgents.length > 0) {
        await addUserAgents.call(this, room.key, adminUserAgents, { isAdmin: true, transacting });
      }
      return room;
    },
    table.room,
    _transacting
  );
}

module.exports = { add };
