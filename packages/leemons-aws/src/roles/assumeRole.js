const { STSClient, AssumeRoleCommand } = require('@aws-sdk/client-sts');
const { LeemonsError } = require('@leemons/error');
const { getAWSConfig } = require('../config/getAWSConfig');

/**
 * @typedef {import("../types").AWSCredentials} AWSCredentials
 * @typedef {import("@leemons/deployment-manager").Context} Context
 */

/**
 *
 * @param {object} props
 * @param {string} props.roleArn
 * @param {string} props.sessionName
 * @param {AWSCredentials} props.credentials
 * @param {Context} props.ctx
 */
async function assumeRole({ roleArn, sessionName, credentials, ctx }) {
  try {
    const sts = new STSClient(getAWSConfig({ credentials }));

    const RoleSessionName = `leemons-${ctx.service.fullName}`;

    const command = new AssumeRoleCommand({
      RoleArn: roleArn,
      RoleSessionName: sessionName ? `${RoleSessionName}-${sessionName}` : RoleSessionName,
    });

    const { Credentials } = await sts.send(command);

    return {
      accessKeyId: Credentials.AccessKeyId,
      secretAccessKey: Credentials.SecretAccessKey,
      sessionToken: Credentials.SessionToken,
      region: credentials?.region ?? undefined,
    };
  } catch (error) {
    throw new LeemonsError(ctx, {
      message: 'Error assuming role',
      cause: error,
      customCode: 'LEEMONS_ERROR_ASSUMING_ROLE',
      httpStatusCode: 500,
    });
  }
}

/**
 *
 * @param {{prefix: string} | {roleName: string}} props
 * @returns {string | null}
 */
function getRoleToAssume({ prefix, roleName }) {
  const upperCasePrefix = prefix?.toUpperCase();

  return (
    roleName ?? process.env[prefix ? `${upperCasePrefix}_ASSUMED_ROLE` : 'ASSUMED_ROLE'] ?? null
  );
}

module.exports = { assumeRole, getRoleToAssume };
