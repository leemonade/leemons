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
    program,
    center: _center,
    transacting: _transacting,
  } = {}
) {
  validateKeyPrefix(key, this.calledFrom);

  return global.utils.withTransaction(
    async (transacting) => {
      await validateNotExistRoomKey(key, { transacting });

      const toUpdate = {};

      let center = _center;
      if (program) {
        toUpdate.program = program;
        if (!center) {
          [center] = await leemons
            .getPlugin('academic-portfolio')
            .services.programs.getProgramCenters(program, { transacting });
        }
      }
      if (center) toUpdate.center = center;
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

      const room = await table.room.update({ key }, toUpdate, { transacting });
      let userAgents = [];
      if (image || icon) {
        userAgents = await table.userAgentInRoom.find({ room: key }, { transacting });
      }
      if (image) {
        leemons.socket.emit(_.map(userAgents, 'userAgent'), `COMUNICA:ROOM:UPDATE:IMAGE`, {
          key,
          image,
        });
      }
      if (icon) {
        leemons.socket.emit(_.map(userAgents, 'userAgent'), `COMUNICA:ROOM:UPDATE:ICON`, {
          key,
          image,
        });
      }
      return room;
    },
    table.room,
    _transacting
  );
}

module.exports = { update };
