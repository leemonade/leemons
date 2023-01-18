const _ = require('lodash');
const { table } = require('../tables');
const { validateKeyPrefix, validateNotExistRoomKey } = require('../../validations/exists');

async function update(
  key,
  {
    name,
    subName,
    bgColor,
    icon,
    iconPermissions,
    image,
    imagePermissions,
    parentRoom,
    userSession,
    transacting: _transacting,
  } = {}
) {
  const assetService = leemons.getPlugin('leebrary').services.assets;

  validateKeyPrefix(key, this.calledFrom);

  return global.utils.withTransaction(
    async (transacting) => {
      await validateNotExistRoomKey(key, { transacting });

      const toUpdate = {};

      if (name) toUpdate.name = name;
      if (bgColor) toUpdate.bgColor = bgColor;
      if (subName) toUpdate.subName = subName;
      if (parentRoom) toUpdate.parentRoom = parentRoom;

      let room = await table.room.update({ key }, toUpdate, { transacting });

      // ES: Añadimos el asset de la imagen
      const imageData = {
        indexable: false,
        public: true,
        name: room.id,
      };
      if (image) imageData.cover = image;
      let assetImage = null;
      if (!_.isUndefined(image)) {
        if (room.image) {
          assetImage = await assetService.update(
            { id: room.image, ...imageData },
            {
              published: true,
              userSession,
              transacting,
            }
          );
        } else {
          assetImage = await assetService.add(imageData, {
            permissions: imagePermissions,
            published: true,
            userSession,
            transacting,
          });
        }
        room = await table.room.update({ id: room.id }, { image: assetImage.id }, { transacting });
      }

      // ES: Añadimos el asset de la imagen
      const iconData = {
        indexable: false,
        public: true,
        name: room.id,
      };
      if (icon) iconData.cover = icon;
      let iconImage = null;
      if (!_.isUndefined(icon)) {
        if (room.icon) {
          iconImage = await assetService.update(
            { id: room.icon, ...iconData },
            {
              published: true,
              userSession,
              transacting,
            }
          );
        } else {
          iconImage = await assetService.add(iconData, {
            permissions: iconPermissions,
            published: true,
            userSession,
            transacting,
          });
        }
        room = await table.room.update({ id: room.id }, { icon: iconImage.id }, { transacting });
      }

      return room;
    },
    table.room,
    _transacting
  );
}

module.exports = { update };
