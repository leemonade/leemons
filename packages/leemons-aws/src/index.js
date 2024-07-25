const { getAWSConfig } = require('./config/getAWSConfig');
const {
  getAWSCredentials,
  getAWSCredentialsFromDB,
  getAWSCredentialsFromEnv,
} = require('./credentials/getAWSCredentials');
const saveAWSCredentials = require('./credentials/saveAWSCredentials');
const { assumeRole, getRoleToAssume } = require('./roles/assumeRole');

module.exports = {
  saveAWSCredentials,

  getAWSCredentials,
  getAWSCredentialsFromDB,
  getAWSCredentialsFromEnv,

  assumeRole,
  getRoleToAssume,

  getAWSConfig,
};
