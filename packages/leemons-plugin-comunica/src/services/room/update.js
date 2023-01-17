const _ = require('lodash');
const { table } = require('../tables');
const { validateKeyPrefix, validateExistRoomKey } = require('../../validations/exists');

async function add(
  key,
  {
    name,
    subName,
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
      await validateExistRoomKey(key, { transacting });

      let room = await table.room.create(
        {
          key,
          name,
          subName,
          parentRoom,
        },
        { transacting }
      );

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

      return room;
    },
    table.room,
    _transacting
  );
}

module.exports = { add };
