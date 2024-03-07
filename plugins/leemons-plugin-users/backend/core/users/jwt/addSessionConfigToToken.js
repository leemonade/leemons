/* eslint-disable no-param-reassign */
const _ = require('lodash');
const { verifyJWTToken } = require('./verifyJWTToken');
const { generateJWTToken } = require('./generateJWTToken');

async function addSessionConfigToToken({ token, sessionConfig = {}, ctx }) {
  const tokens = _.isArray(token) ? token : [token];
  const tokenValues = await Promise.all(
    _.map(tokens, (tok) => verifyJWTToken({ token: tok, ctx }))
  );

  const promises = [];
  _.forEach(tokenValues, (tokenValue) => {
    if (!_.isObject(tokenValue.sessionConfig)) tokenValue.sessionConfig = {};
    tokenValue.sessionConfig = { ...tokenValue.sessionConfig, ...sessionConfig };
    delete tokenValue.iat;
    delete tokenValue.exp;
    promises.push(generateJWTToken({ payload: tokenValue, ctx }));
  });

  const result = await Promise.all(promises);
  return _.isArray(token) ? result : result[0];
}

module.exports = { addSessionConfigToToken };
