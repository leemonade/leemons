const _ = require('lodash');
const {
  validateKeyPrefix,
  validateNotExistRoomKey,
  validateNotExistUserAgentInRoomKey,
} = require('../../validations/exists');
const { LeemonsError } = require('leemons-error');

async function adminChangeRoomImage({ key, avatar, ctx }) {
  const { userSession } = ctx.meta;
  const userAgent = userSession.userAgents[0].id;
  validateKeyPrefix({ key, calledFrom: ctx.callerPlugin, ctx });
  await validateNotExistRoomKey({ key, ctx });
  await validateNotExistUserAgentInRoomKey({ key, userAgent, ctx });
  const admin = await ctx.tx.db.UserAgentInRoom.findOne({
    room: key,
    userAgent,
  }).lean();

  if (!admin.isAdmin)
    throw new LeemonsError(ctx, { message: 'You don`t have permissions for update room image' });

  const room = await ctx.tx.db.Room.findOne({ key }).lean();

  const assetData = {
    indexable: false,
    public: true,
    name: `room-${key}`,
  };
  if (avatar) assetData.cover = avatar;
  let asset;
  if (room.image) {
    asset = await ctx.tx.call('leebrary.assets.update', {
      data: { ...assetData, id: room.image },
      published: true,
    });
  } else {
    asset = await ctx.tx.call('leebrary.assets.add', {
      asset: assetData,
      options: {
        published: true,
      },
    });
  }
  await ctx.tx.db.Room.updateOne({ id: room.id }, { image: asset.id });

  const userAgents = await ctx.tx.db.UserAgentInRoom.find({ room: key }).lean();
  ctx.socket.emit(_.map(userAgents, 'userAgent'), `COMUNICA:ROOM:UPDATE:IMAGE`, {
    key,
    image: asset.id,
  });

  return {
    ...room,
    image: asset.id,
  };
}

module.exports = { adminChangeRoomImage };
