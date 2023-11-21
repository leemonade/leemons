const _ = require('lodash');
const { validateKeyPrefix, validateExistRoomKey } = require('../../validations/exists');
const { addUserAgents } = require('./addUserAgents');

async function add({
  key,
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
  ctx,
} = {}) {
  validateKeyPrefix({ key, calledFrom: ctx.callerPlugin, ctx });

  await validateExistRoomKey({ key, ctx });

  let center = _center;

  if (program && !center) {
    [center] = await ctx.tx.call('academic-portfolio.programs.getProgramCenters', {
      programId: program,
    });
  }

  let room = await ctx.tx.db.Room.create({
    key,
    name,
    type,
    nameReplaces: JSON.stringify(nameReplaces),
    initDate,
    bgColor,
    subName,
    icon,
    image,
    parentRoom: _.isArray(parentRoom) ? parentRoom[0] : parentRoom,
    useEncrypt,
    program,
    center,
    metadata: JSON.stringify(metadata),
  });
  room = room.toObject();

  if (viewPermissions) {
    await ctx.tx.call('users.permissions.addItem', {
      item: key,
      type: 'comunica.room.view',
      data: viewPermissions,
      isCustomPermission: true,
    });
  }

  if (userAgents.length > 0) {
    await addUserAgents({
      key: room.key,
      userAgents,
      ctx,
    });
  }
  if (adminUserAgents.length > 0) {
    await addUserAgents({
      key: room.key,
      userAgents: adminUserAgents,
      isAdmin: true,
      ctx,
    });
  }
  return room;
}

module.exports = { add };
