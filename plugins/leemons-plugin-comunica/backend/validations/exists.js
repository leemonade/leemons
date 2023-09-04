const _ = require('lodash');
const { exist: existRoom } = require('../core/room/exist');
const { existUserAgent } = require('../core/room/existUserAgent');
const { LeemonsError } = require('leemons-error');

function validateKeyPrefix({ key: _key, calledFrom, ctx }) {
  if (calledFrom) {
    const keys = _.isArray(_key) ? _key : [_key];
    _.forEach(keys, (key) => {
      if (!key.startsWith(calledFrom) && calledFrom !== 'fundae')
        throw new LeemonsError(ctx, { message: `The key must begin with ${calledFrom}` });
    });
  }
}

async function validateExistRoomKey({ key, ctx }) {
  if (await existRoom({ key, ctx }))
    throw new LeemonsError(ctx, { message: `Room '${key}' already exists` });
}

async function validateNotExistRoomKey({ key, ctx }) {
  if (!(await existRoom({ key, ctx })))
    throw new LeemonsError(ctx, { message: `Room '${key}' not exists` });
}

async function validateNotExistUserAgentInRoomKey({ key, userAgent, ctx }) {
  if (!(await existUserAgent({ room: key, userAgent, ctx })))
    throw new LeemonsError(ctx, {
      message: `User agent '${userAgent}' not exists in room '${key}'`,
    });
}

module.exports = {
  validateKeyPrefix,
  validateExistRoomKey,
  validateNotExistRoomKey,
  validateNotExistUserAgentInRoomKey,
};
