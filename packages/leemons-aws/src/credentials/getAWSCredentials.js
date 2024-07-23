const { getRoleToAssume, assumeRole } = require('../roles/assumeRole');

/**
 * @typedef {import("../../types").AWSCredentials} AWSCredentials
 * @typedef {import("@leemons/deployment-manager").Context} Context
 */

/**
 *
 * @param {object} props
 * @param {string} [props.ctxKeyValueModelName]
 * @param {Context} props.ctx
 * @returns {Promise<AWSCredentials | null>}
 */
async function getAWSCredentialsFromDB({ ctxKeyValueModelName = 'KeyValue', ctx }) {
  const keyValueModel = ctx.tx.db[ctxKeyValueModelName];
  const awsCredentials = await keyValueModel.findOne({ key: 'awsCredentials' }).lean();

  return awsCredentials?.value ?? null;
}

/**
 *
 * @param {string} prefix
 * @returns {AWSCredentials | null}
 */
function getAWSCredentialsFromEnv(prefix) {
  let accessKeyId = process.env.AWS_ACCESS_KEY;
  let secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
  let region = process.env.AWS_REGION;
  let sessionToken = process.env.AWS_SESSION_TOKEN;

  const upperCasePrefix = prefix?.toUpperCase();

  if (prefix) {
    accessKeyId = process.env[`${upperCasePrefix}_AWS_ACCESS_KEY`] ?? accessKeyId;
    secretAccessKey = process.env[`${upperCasePrefix}_AWS_SECRET_ACCESS_KEY`] ?? secretAccessKey;
    region = process.env[`${upperCasePrefix}_AWS_REGION`] ?? region;
    sessionToken = process.env[`${upperCasePrefix}_AWS_SESSION_TOKEN`] ?? sessionToken;
  }

  if (!accessKeyId || !secretAccessKey || !region) {
    return null;
  }

  return { accessKeyId, secretAccessKey, region, sessionToken };
}

/**
 *
 * @param {object} props
 * @param {string} [props.ctxKeyValueModelName]
 * @param {string} [props.prefix]
 * @param {string} [props.roleName]
 * @param {Context} props.ctx
 * @returns {Promise<AWSCredentials | null>}
 */
async function getAWSCredentials({
  ctxKeyValueModelName = 'KeyValue',
  prefix,
  roleName,
  sessionName,
  rolePolicy,
  ctx,
}) {
  const dbCredentials = await getAWSCredentialsFromDB({ ctxKeyValueModelName, ctx });
  const envCredentials = getAWSCredentialsFromEnv(prefix);

  const roleToAssume = getRoleToAssume({ roleName, prefix });

  if (roleToAssume) {
    return assumeRole({
      roleArn: roleToAssume,
      sessionName,
      credentials: dbCredentials ?? envCredentials,
      policy: rolePolicy,
      ctx,
    });
  }

  return dbCredentials ?? envCredentials ?? null;
}

module.exports = { getAWSCredentials, getAWSCredentialsFromDB, getAWSCredentialsFromEnv };
