const _ = require('lodash');
const { table } = require('../tables');
const { validateKeyPrefix, validateNotExistRoomKey } = require('../../validations/exists');

async function update(
  key,
  {
    name,
    type,
    initDate,
    nameReplaces,
    subName,
    bgColor,
    icon,
    image,
    metadata,
    parentRoom,
    transacting: _transacting,
  } = {}
) {
  validateKeyPrefix(key, this.calledFrom);

  return global.utils.withTransaction(
    async (transacting) => {
      await validateNotExistRoomKey(key, { transacting });

      const toUpdate = {};

      if (type) toUpdate.type = type;
      if (name) toUpdate.name = name;
      if (icon) toUpdate.icon = icon;
      if (image) toUpdate.image = image;
      if (bgColor) toUpdate.bgColor = bgColor;
      if (subName) toUpdate.subName = subName;
      if (initDate) toUpdate.initDate = initDate;
      if (metadata) toUpdate.metadata = JSON.stringify(metadata);
      if (parentRoom) toUpdate.parentRoom = parentRoom;
      if (nameReplaces) toUpdate.nameReplaces = JSON.stringify(nameReplaces);

      return table.room.update({ key }, toUpdate, { transacting });
    },
    table.room,
    _transacting
  );
}

module.exports = { update };
