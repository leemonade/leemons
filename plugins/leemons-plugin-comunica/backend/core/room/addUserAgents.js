const _ = require('lodash');
const { validateKeyPrefix, validateNotExistRoomKey } = require('../../validations/exists');
const { randomString } = require('leemons-utils');

async function add({ room, userAgent, isAdmin, ctx }) {
  const response = await ctx.tx.db.UserAgentInRoom.findOne(
    {
      room,
      userAgent,
    },
    undefined,
    { excludeDeleted: false }
  ).lean();
  if (response) {
    // Si la existe el usuario en la sala, pero borrado se le reactiva
    if (response.isDeleted) {
      const result = await ctx.tx.db.UserAgentInRoom.findOneAndUpdate(
        {
          room,
          userAgent,
        },
        {
          isAdmin,
          isDeleted: false,
          deletedAt: null,
        },
        { lean: true, new: true, excludeDeleted: false }
      );
      return {
        added: true,
        userAgent,
        result,
      };
    }
    // Si el usuario existe pero el isAdmin es distinto lo actualizamos
    if (!!response.isAdmin !== !!isAdmin) {
      const result = await ctx.tx.db.UserAgentInRoom.findOneAndUpdate(
        {
          room,
          userAgent,
        },
        {
          isAdmin,
          isDeleted: false,
          deletedAt: null,
        },
        { new: true, lean: true, excludeDeleted: false }
      );
      return {
        added: true,
        userAgent,
        result,
      };
    }
    return {
      added: false,
      userAgent,
      result: response,
    };
  }
  // Si el usuario no esta en la sala le añadimos
  let result = await ctx.tx.db.UserAgentInRoom.create({
    room,
    userAgent,
    isAdmin,
    encryptKey: randomString(16),
  });
  result = result.toObject();
  return {
    added: true,
    userAgent,
    result,
  };
}

async function addUserAgents({ key, userAgents: _userAgents, isAdmin, ignoreCalledFrom, ctx }) {
  if (!ignoreCalledFrom) validateKeyPrefix({ key, calledFrom: ctx.callerPlugin, ctx });

  const userAgents = _.isArray(_userAgents) ? _userAgents : [_userAgents];

  await validateNotExistRoomKey({ key, ctx });

  const currentUserAgentsInRoom = await ctx.tx.db.UserAgentInRoom.find({ room: key }).lean();

  const results = await Promise.all(
    _.map(userAgents, (userAgent) => add({ room: key, userAgent, isAdmin, ctx }))
  );

  const responsesAdded = _.filter(results, { added: true });

  // Informamos a los usuarios añadidos de que han sido añadidos
  ctx.socket.emit(_.map(responsesAdded, 'userAgent'), `COMUNICA:ROOM:ADDED`, {
    room: key,
  });

  // Vamos a sacar los usuarios añadidos para enviarle a todas los usuarios de antes los nuevos usuarios
  const userAgen = await ctx.tx.call('users.users.getUserAgentsInfo', {
    userAgentIds: _.map(responsesAdded, 'userAgent'),
    withProfile: true,
  });
  const userAgentsById = _.keyBy(userAgen, 'id');
  const userAgentsAddedGood = _.map(responsesAdded, (a) => ({
    userAgent: userAgentsById[a.userAgent],
    adminMuted: a.result.adminMuted,
    isAdmin: a.result.isAdmin,
    deleted: a.result.isDeleted,
    isDeleted: a.result.isDeleted,
  }));

  _.forEach(userAgentsAddedGood, (data) => {
    ctx.socket.emit(_.map(currentUserAgentsInRoom, 'userAgent'), `COMUNICA:ROOM:USER_ADDED`, {
      key,
      userAgent: data,
    });
  });

  const responses = _.map(results, 'result');
  _.forEach(responses, (response) => {
    delete response.encryptKey;
  });

  return _.isArray(_userAgents) ? responses : responses[0];
}

module.exports = { addUserAgents };
