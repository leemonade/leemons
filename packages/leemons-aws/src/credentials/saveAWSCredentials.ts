import { LeemonsError } from "@leemons/error";
import type { Context } from "@leemons/moleculer";
import type { Model } from "@leemons/mongodb";
import type { AWSCredentials } from "../index";

type SaveAWSCredentialsProps<C extends Context = Context> = {
  credentials: AWSCredentials;
  ctxKeyValueModelName?: string;
  ctx: C;
};

export async function saveAWSCredentials<C extends Context = Context>({
  credentials,
  ctxKeyValueModelName = "KeyValue",
  ctx,
}: SaveAWSCredentialsProps<C>) {
  const { accessKeyId, secretAccessKey, region } = credentials;
  const keyValueModel: Model<{ key: string; value: AWSCredentials }> =
    ctx.tx.db[ctxKeyValueModelName];

  try {
    return await keyValueModel
      .findOneAndUpdate(
        { key: "awsCredentials" },
        { value: { accessKeyId, secretAccessKey, region } },
        {
          new: true,
          upsert: true,
        }
      )
      .lean();
  } catch (error) {
    throw new LeemonsError(ctx, {
      message: "Error saving AWS credentials",
      cause: error,
      customCode: "LEEMONS_ERROR_SAVING_AWS_CREDENTIALS",
      httpStatusCode: 500,
    });
  }
}
