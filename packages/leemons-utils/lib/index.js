const _ = require('lodash');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const aws = require('aws-sdk');
const slugify = require('slugify');
const squirrelly = require('squirrelly');
const execa = require('execa');
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

squirrelly.helpers.define('printWithOutErrors', function ({ params }) {
  const it = params[0];
  const prop = params[1];
  const value = _.get(it, prop, '');
  return _.isArray(value) || _.isObject(value) ? `-*-*-${JSON.stringify(value)}-*-*-` : value;
});

module.exports = {
  env,
  getModel,
  generateModelName,
  buildQuery,
  parseFilters,
  getStackTrace,
  getAvailablePort,
  nodemailer,
  LeemonsValidator,
  HttpError,
  HttpErrorWithCustomCode,
  HttpErrorPermissions,
  returnError,
  bcrypt,
  jwt,
  settledResponseToManyResponse,
  aws,
  paginate,
  randomString,
  slugify,
  withTransaction,
  squirrelly,
  getObjectArrayKeys,
  timeoutPromise: (time) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, time);
    });
  },
};
