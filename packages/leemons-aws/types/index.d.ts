import type { STSClientConfig } from '@aws-sdk/client-sts';
import type { Context } from '@leemons/deployment-manager';

export type AWSCredentials = {
  accessKeyId: string;
  secretAccessKey: string;
  region: string;
  sessionToken?: string;
  expiresAt?: string;
};

export type AWSClientConfig = STSClientConfig;

export type GetAWSCredentialsProps<C = Context> = {
  ctxKeyValueModelName?: string;
  prefix?: string;
  roleName?: string;
  sessionName?: string;
  rolePolicy?: string;
  ctx: C;
};

export function getAWSCredentials<C = Context>(props: GetAWSCredentialsProps<C>): Promise<AWSCredentials | null>;
