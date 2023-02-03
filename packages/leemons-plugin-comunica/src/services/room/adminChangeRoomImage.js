const _ = require('lodash');
const { table } = require('../tables');
const {
  validateKeyPrefix,
  validateNotExistRoomKey,
  validateNotExistUserAgentInRoomKey,
} = require('../../validations/exists');

async function adminChangeRoomImage(key, userSession, avatar, { transacting } = {}) {
  const userAgent = userSession.userAgents[0].id;
  validateKeyPrefix(key, this.calledFrom);
  await validateNotExistRoomKey(key, { transacting });
  await validateNotExistUserAgentInRoomKey(key, userAgent, { transacting });
  const admin = await table.userAgentInRoom.findOne(
    {
      room: key,
      userAgent,
    },
    { transacting }
  );

  if (!admin.isAdmin) throw new Error('You don`t have permissions for update room image');

  const room = await table.room.findOne({ key }, { transacting });

  const assetService = leemons.getPlugin('leebrary').services.assets;
  const assetData = {
    indexable: false,
    public: true,
    name: `room-${key}`,
  };
  if (avatar) assetData.cover = avatar;
  let asset;
  if (room.image) {
    asset = await assetService.update(
      { ...assetData, id: room.image },
      {
        published: true,
        userSession,
        transacting,
      }
    );
  } else {
    asset = await assetService.add(assetData, {
      published: true,
      userSession,
      transacting,
    });
  }
  await table.room.update(
    { id: room.id },
    {
      image: asset.id,
    },
    {
      transacting,
    }
  );

  const userAgents = await table.userAgentInRoom.find({ room: key }, { transacting });
  leemons.socket.emit(_.map(userAgents, 'userAgent'), `COMUNICA:ROOM:UPDATE:IMAGE`, {
    key,
    image: asset.id,
  });

  return {
    ...room,
    image: asset.id,
  };
}

module.exports = { adminChangeRoomImage };
