import type { AwsCredentialIdentity } from '@aws-sdk/types';
import { cloneDeep } from 'lodash';
import type { AWSClientConfig, AWSCredentials } from '../index';

type GetAWSConfigProps = {
  config?: AWSClientConfig;
  credentials: AWSCredentials;
};

// Create a mutable version of AwsCredentialIdentity
type MutableAwsCredentials = {
  -readonly [K in keyof AwsCredentialIdentity]: AwsCredentialIdentity[K];
};

export function getAWSConfig({ config = {}, credentials }: GetAWSConfigProps): AWSClientConfig {
  const clientConfig = cloneDeep(config) as AWSClientConfig;

  if (credentials) {
    clientConfig.credentials = {} as MutableAwsCredentials;
  }
  if (credentials?.accessKeyId) {
    (clientConfig.credentials as MutableAwsCredentials).accessKeyId = credentials.accessKeyId;
  }
  if (credentials?.secretAccessKey) {
    (clientConfig.credentials as MutableAwsCredentials).secretAccessKey =
      credentials.secretAccessKey;
  }
  if (credentials?.sessionToken) {
    (clientConfig.credentials as MutableAwsCredentials).sessionToken = credentials.sessionToken;
  }
  if (credentials?.expiresAt) {
    // AWS SDK expects a Date object for expiration
    (clientConfig.credentials as MutableAwsCredentials).expiration = new Date(
      credentials.expiresAt
    );
  }
  if (credentials?.region) {
    clientConfig.region = credentials.region;
  }

  return clientConfig;
}
