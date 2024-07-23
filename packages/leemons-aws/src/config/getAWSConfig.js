const { cloneDeep } = require('lodash');

/**
 * @typedef {import('../../types').AWSClientConfig} AWSClientConfig
 * @typedef {import('../../types').AWSCredentials} AWSCredentials
 */

/**
 *
 * @param {Object} props
 * @param {AWSClientConfig} props.config
 * @param {AWSCredentials} props.credentials
 */
function getAWSConfig({ config = {}, credentials }) {
  const clientConfig = cloneDeep(config);

  if (credentials) {
    clientConfig.credentials = {};
  }
  if (credentials?.accessKeyId) {
    clientConfig.credentials.accessKeyId = credentials.accessKeyId;
  }
  if (credentials?.secretAccessKey) {
    clientConfig.credentials.secretAccessKey = credentials.secretAccessKey;
  }
  if (credentials?.sessionToken) {
    clientConfig.credentials.sessionToken = credentials.sessionToken;
  }
  if (credentials?.expiresAt) {
    clientConfig.credentials.expiration = credentials.expiresAt;
  }
  if (credentials?.region) {
    clientConfig.region = credentials.region;
  }

  if (credentials?.sessionToken) {
    clientConfig.credentials.sessionToken = credentials.sessionToken;
  }

  return clientConfig;
}

module.exports = { getAWSConfig };
