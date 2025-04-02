import { LeemonsError } from '@leemons/error';
import { AnyContext } from '@leemons/moleculer';
import type { AWSCredentials } from '../index';

type SaveAWSCredentialsProps<C extends AnyContext = AnyContext> = {
  credentials: AWSCredentials;
  ctxKeyValueModelName?: string;
  ctx: C;
};

export async function saveAWSCredentials<C extends AnyContext = AnyContext>({
  credentials,
  ctxKeyValueModelName = 'KeyValue',
  ctx,
}: SaveAWSCredentialsProps<C>) {
  const { accessKeyId, secretAccessKey, region } = credentials;
  const keyValueModel = (ctx as any).db[ctxKeyValueModelName];

  try {
    return await keyValueModel
      .findOneAndUpdate(
        { key: 'awsCredentials' },
        { value: { accessKeyId, secretAccessKey, region } },
        {
          new: true,
          upsert: true,
        }
      )
      .lean();
  } catch (error) {
    throw new LeemonsError(ctx, {
      message: 'Error saving AWS credentials',
      cause: error,
      customCode: 'LEEMONS_ERROR_SAVING_AWS_CREDENTIALS',
      httpStatusCode: 500,
    });
  }
}
