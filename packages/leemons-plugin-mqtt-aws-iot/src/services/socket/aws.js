/* eslint-disable no-use-before-define */
const _ = require('lodash');
const { tables } = require('../tables');

let config = null;
let account = null;
let configDateEnd = null;

function configChanged() {
  config = null;
  account = null;
  configDateEnd = null;
}

async function getConfig({ transacting } = {}) {
  const now = new Date();
  if (configDateEnd && configDateEnd > now) {
    config = null;
    account = null;
  }
  if (!config) {
    config = await tables.config.findOne({}, { transacting });
    // Cacheamos la config durante 15 minutos, por si el token a cambiado.
    configDateEnd = new Date();
    configDateEnd = new Date(configDateEnd.getTime() + 15 * 60000);
  }
  if (!config) throw new Error('Please config your aws iot credentials');
  return config;
}

async function getIot({ transacting } = {}) {
  await getConfig({ transacting });
  return new global.utils.aws.Iot({
    region: config.region,
    accessKeyId: config.accessKeyId,
    secretAccessKey: config.secretAccessKey,
  });
}

async function getSts({ transacting } = {}) {
  await getConfig({ transacting });
  return new global.utils.aws.STS({
    region: config.region,
    accessKeyId: config.accessKeyId,
    secretAccessKey: config.secretAccessKey,
  });
}

async function getRegion({ transacting } = {}) {
  await getConfig({ transacting });
  return config.region;
}

async function getAccount() {
  const sts = await getSts();
  if (account) return account;

  return new Promise((resolve, reject) => {
    sts.getCallerIdentity({}, (err, data) => {
      if (err) {
        reject(err);
      } else {
        account = data.Accoun;
        resolve(data.Account);
      }
    });
  });
}

async function getFederationToken(policy, { transacting } = {}) {
  if (!policy) throw new Error('Policy is required');
  const sts = await getSts({ transacting });

  return new Promise((resolve, reject) => {
    sts.getFederationToken(
      {
        Name: global.utils.randomString(32),
        DurationSeconds: 129600,
        Policy: _.isString(policy) ? policy : JSON.stringify(policy),
      },
      (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      }
    );
  });
}

/** {
          Version: '2012-10-17',
          Statement: [
            {
              Effect: 'Allow',
              Action: [
                'iot:Connect',
                'iot:Publish',
                'iot:Subscribe',
                'iot:Receive',
                'iot:DescribeEndpoint',
              ],
              Resource: '*',
            },
          ],
        } */

module.exports = { getIot, getRegion, getFederationToken, getAccount, configChanged };
