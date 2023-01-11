const _ = require('lodash');
const { exist: existRoom } = require('../services/room/exist');
const { existUserAgent } = require('../services/room/existUserAgent');

function validateKeyPrefix(_key, calledFrom) {
  if (calledFrom) {
    const keys = _.isArray(_key) ? _key : [_key];
    _.forEach(keys, (key) => {
      if (!key.startsWith(calledFrom) && calledFrom !== 'plugins.fundae')
        throw new Error(`The key must begin with ${calledFrom}`);
    });
  }
}

async function validateExistRoomKey(key, { transacting } = {}) {
  if (await existRoom(key, { transacting })) throw new Error(`Room '${key}' already exists`);
}

async function validateNotExistRoomKey(key, { transacting } = {}) {
  if (!(await existRoom(key, { transacting }))) throw new Error(`Room '${key}' not exists`);
}

async function validateNotExistUserAgentInRoomKey(key, userAgent, { transacting } = {}) {
  if (!(await existUserAgent(key, userAgent, { transacting })))
    throw new Error(`User agent '${userAgent}' not exists in room '${key}'`);
}

module.exports = {
  validateKeyPrefix,
  validateExistRoomKey,
  validateNotExistRoomKey,
  validateNotExistUserAgentInRoomKey,
};
