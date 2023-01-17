const _ = require('lodash');
const { table } = require('../tables');
const { validateKeyPrefix, validateExistRoomKey } = require('../../validations/exists');
const { addUserAgents } = require('./addUserAgents');

async function add(
  key,
  {
    name,
    subName,
    image,
    imagePermissions,
    userAgents = [],
    parentRoom,
    useEncrypt = true,
    viewPermissions,
    userSession,
    transacting: _transacting,
  } = {}
) {
  const assetService = leemons.getPlugin('leebrary').services.assets;

  validateKeyPrefix(key, this.calledFrom);

  return global.utils.withTransaction(
    async (transacting) => {
      await validateExistRoomKey(key, { transacting });

      let room = await table.room.create(
        {
          key,
          name,
          subName,
          parentRoom,
          useEncrypt,
        },
        { transacting }
      );

      // ES: Añadimos el asset de la imagen
      if (image) {
        const imageData = {
          indexable: false,
          public: true,
          name: room.id,
          cover: image,
        };

        const assetImage = await assetService.add(imageData, {
          permissions: imagePermissions,
          published: true,
          userSession,
          transacting,
        });

        room = await table.room.update({ id: room.id }, { image: assetImage.id }, { transacting });
      }

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
