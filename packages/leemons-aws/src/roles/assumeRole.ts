import { AssumeRoleCommand, STSClient } from '@aws-sdk/client-sts';
import { LeemonsError } from '@leemons/error';
import { getAWSConfig } from '../config/getAWSConfig';
import type { AWSCredentials } from '../index';

type AssumeRoleProps<C = any> = {
  roleArn: string;
  sessionName?: string;
  credentials: AWSCredentials;
  policy?: string;
  ctx: C;
};

type GetRoleToAssumeProps = {
  prefix?: string;
  roleName?: string;
};

export async function assumeRole<C = any>({
  roleArn,
  sessionName,
  credentials,
  policy,
  ctx,
}: AssumeRoleProps<C>): Promise<AWSCredentials> {
  try {
    const sts = new STSClient(getAWSConfig({ credentials }));

    const RoleSessionName = `leemons-${(ctx as any).service.fullName}`;

    const command = new AssumeRoleCommand({
      RoleArn: roleArn,
      RoleSessionName: sessionName ? `${RoleSessionName}-${sessionName}` : RoleSessionName,
      Policy: policy,
    });

    const { Credentials } = await sts.send(command);

    if (!Credentials) {
      throw new Error('No credentials returned from AWS');
    }

    return {
      accessKeyId: Credentials.AccessKeyId ?? '',
      secretAccessKey: Credentials.SecretAccessKey ?? '',
      sessionToken: Credentials.SessionToken,
      region: credentials?.region ?? '',
    };
  } catch (error) {
    throw new LeemonsError(ctx as any, {
      message: 'Error assuming role',
      cause: error,
      customCode: 'LEEMONS_ERROR_ASSUMING_ROLE',
      httpStatusCode: 500,
    });
  }
}

export function getRoleToAssume({ prefix, roleName }: GetRoleToAssumeProps): string | null {
  const upperCasePrefix = prefix?.toUpperCase();

  return (
    roleName ?? process.env[prefix ? `${upperCasePrefix}_ASSUMED_ROLE` : 'ASSUMED_ROLE'] ?? null
  );
}
