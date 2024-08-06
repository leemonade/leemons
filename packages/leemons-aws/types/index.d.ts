import type {STSClientConfig} from '@aws-sdk/client-sts';

export type AWSCredentials = {
  accessKeyId: string;
  secretAccessKey: string;
  region: string;
  sessionToken?: string;
  expiresAt?: string;
};

export type AWSClientConfig = STSClientConfig;
