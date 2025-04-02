import type { STSClientConfig } from '@aws-sdk/client-sts';
import type { Context } from '@leemons/moleculer';

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

export { getAWSConfig } from './config/getAWSConfig';
export {
  getAWSCredentials,
  getAWSCredentialsFromDB,
  getAWSCredentialsFromEnv,
} from './credentials/getAWSCredentials';
export { saveAWSCredentials } from './credentials/saveAWSCredentials';
export { assumeRole, getRoleToAssume } from './roles/assumeRole';
