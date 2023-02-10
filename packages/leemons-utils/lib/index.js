const _ = require('lodash');
const chalk = require('chalk');
const systeminformation = require('systeminformation');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const aws = require('aws-sdk');
const awsIotDeviceSdk = require('aws-iot-device-sdk');
const cron = require('node-cron');
const slugify = require('slugify');
const squirrelly = require('squirrelly');
// const execa = require('execa');
const { ImporterFactory } = require('xlsx-import/lib/ImporterFactory');
const mediaInfo = require('mediainfo.js');
const got = require('got');
const sharp = require('sharp');
const xml2json = require('xml2json');
const uuid = require('uuid');
const decompress = require('decompress');
const documentInfo = require('./documentInfo');
const { fetch, fetchJson, fetchText } = require('./fetch');
const { env } = require('./env');
const { getModel, generateModelName } = require('./model');
const buildQuery = require('./queryBuilder');
const { parseFilters } = require('./parseFilters');
const getStackTrace = require('./getStackTrace');
const LeemonsValidator = require('./leemons-validator');
const { settledResponseToManyResponse } = require('./settled-response-to-many-response');
const {
  HttpError,
  returnError,
  HttpErrorWithCustomCode,
  HttpErrorPermissions,
} = require('./http-error');
const { getAvailablePort } = require('./port');
const paginate = require('./paginate');
const randomString = require('./randomString');
const getObjectArrayKeys = require('./getObjectArrayKeys');
const { withTransaction } = require('./withTransaction');
const numberToEncodedLetter = require('./numberToEncodedLetter');
const sqlDatetime = require('./sqlDatetime');
const metascraper = require('./metascraper');
const getDiff = require('./getDiff');
const getPermissionsForRoutes = require('./getPermissionsForRoutes');

squirrelly.helpers.define('printWithOutErrors', ({ params }) => {
  const it = params[0];
  const prop = params[1];
  const value = _.get(it, prop, '');
  return _.isArray(value) || _.isObject(value) ? `-*-*-${JSON.stringify(value)}-*-*-` : value;
});

function diffHours(dt2, dt1) {
  let diff = (dt2.getTime() - dt1.getTime()) / 1000;
  diff /= 60 * 60;
  return Math.abs(Math.round(diff));
}

module.exports = {
  env,
  getModel,
  generateModelName,
  buildQuery,
  parseFilters,
  getStackTrace,
  getAvailablePort,
  getPermissionsForRoutes,
  nodemailer,
  LeemonsValidator,
  HttpError,
  HttpErrorWithCustomCode,
  HttpErrorPermissions,
  returnError,
  bcrypt,
  jwt,
  systeminformation,
  settledResponseToManyResponse,
  aws,
  paginate,
  randomString,
  slugify,
  withTransaction,
  squirrelly,
  awsIotDeviceSdk,
  getObjectArrayKeys,
  numberToEncodedLetter,
  timeoutPromise: (time) =>
    new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, time);
    }),
  fetch,
  fetchJson,
  fetchText,
  sqlDatetime,
  XlsxImporter: ImporterFactory,
  metascraper,
  mediaInfo,
  documentInfo,
  got,
  sharp,
  decompress,
  xml2json,
  getDiff,
  chalk,
  uuid,
  cron: {
    ...cron,
    schedule: (cronReg, callback) => {
      let schedule = null;
      leemons.events.once('appDidLoadBack', () => {
        schedule = cron.schedule(cronReg, callback);
      });
      leemons.events.once('appWillReload', () => {
        if (schedule) {
          schedule.stop();
        }
      });
      return schedule;
    },
  },
  encrypt: (payload, secretKey) =>
    jwt.sign({ payload }, secretKey, {
      expiresIn: 60 * 60 * 24 * 365 * 9999, // 9999 years
    }),
  decrypt: (token, secretKey) => {
    const { payload } = jwt.verify(token, secretKey);
    return payload;
  },
  diffHours,
};
