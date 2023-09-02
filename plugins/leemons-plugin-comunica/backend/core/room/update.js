const _ = require('lodash');
const { validateKeyPrefix, validateNotExistRoomKey } = require('../../validations/exists');

async function update({
  key,
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
  ctx,
}) {
  validateKeyPrefix({ key, calledFrom: ctx.callerPlugin, ctx });

  await validateNotExistRoomKey({ key, ctx });

  const toUpdate = {};

  let center = _center;
  if (program) {
    toUpdate.program = program;
    if (!center) {
      [center] = await ctx.tx.call('academic-portfolio.programs.getProgramCenters', {
        programId: program,
      });
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

  const room = await ctx.tx.db.Room.findOneAndUpdate({ key }, toUpdate, { new: true, lean: true });
  let userAgents = [];
  if (image || icon) {
    userAgents = await ctx.tx.db.UserAgentInRoom.find({ room: key }).select(['userAgent']).lean();
  }
  if (image) {
    ctx.socket.emit(_.map(userAgents, 'userAgent'), `COMUNICA:ROOM:UPDATE:IMAGE`, {
      key,
      image,
    });
  }
  if (icon) {
    ctx.socket.emit(_.map(userAgents, 'userAgent'), `COMUNICA:ROOM:UPDATE:ICON`, {
      key,
      image,
    });
  }
  return room;
}

module.exports = { update };
