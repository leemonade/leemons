/* eslint-disable no-async-promise-executor */
/* eslint-disable no-use-before-define */
const _ = require('lodash');
const { LeemonsError } = require('@leemons/error');
const aws = require('aws-sdk');
const { randomString } = require('@leemons/utils');
const { getAWSCredentials } = require('@leemons/aws/src');

let config = null;
let account = null;
let configDateEnd = null;

function configChanged() {
  config = null;
  account = null;
  configDateEnd = null;
}

async function getConfig({ ctx }) {
  const credentials = await getAWSCredentials({ prefix: 'MQTT', ctx });

  if (credentials) {
    config = {
      id: 'aws-iot',
      region: credentials.region,
      accessKeyId: credentials.accessKeyId,
      secretAccessKey: credentials.secretAccessKey,
      sessionToken: credentials.sessionToken,
    };

    return config;
  }

  if (!config) {
    console.error('==============================================');
    console.error('[AWS IOT] No credentials found in @leemons/aws');
    console.error('==============================================');

    config = await ctx.tx.db.Config.findOne({}).lean();
    // Cacheamos la config durante 15 minutos, por si el token a cambiado.
    configDateEnd = new Date();
    configDateEnd = new Date(configDateEnd.getTime() + 15 * 60000);
  }
  if (!config) throw new LeemonsError(ctx, { message: 'Please config your aws iot credentials' });
  return config;
}

async function getIot({ ctx }) {
  await getConfig({ ctx });
  return new aws.Iot({
    region: config.region,
    accessKeyId: config.accessKeyId,
    secretAccessKey: config.secretAccessKey,
    sessionToken: config.sessionToken,
  });
}

async function getSts({ ctx }) {
  await getConfig({ ctx });
  return new aws.STS({
    region: config.region,
    accessKeyId: config.accessKeyId,
    secretAccessKey: config.secretAccessKey,
    sessionToken: config.sessionToken,
  });
}

async function getRegion({ ctx }) {
  await getConfig({ ctx });
  return config.region;
}

async function getAccount({ ctx }) {
  return new Promise(async (resolve, reject) => {
    try {
      const sts = await getSts({ ctx });
      if (account) resolve(account);
      sts.getCallerIdentity({}, (err, data) => {
        if (err) {
          reject(err);
        } else {
          account = data.Accoun;
          resolve(data.Account);
        }
      });
    } catch (e) {
      reject(e);
    }
  });
}

async function getFederationToken({ policy, ctx }) {
  if (!policy) throw new LeemonsError(ctx, { message: 'Policy is required' });
  return new Promise(async (resolve, reject) => {
    try {
      const sts = await getSts({ ctx });
      sts.getFederationToken(
        {
          Name: randomString(32),
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
    } catch (e) {
      reject(e);
    }
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
