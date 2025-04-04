import type { Context } from "@leemons/moleculer";
import type { Model } from "@leemons/mongodb";
import type { AWSCredentials, GetAWSCredentialsProps } from "../index";
import { assumeRole, getRoleToAssume } from "../roles/assumeRole";

type GetAWSCredentialsFromDBProps<C extends Context = Context> = {
  ctxKeyValueModelName?: string;
  ctx: C;
};

async function getAWSCredentialsFromDB<C extends Context = Context>({
  ctxKeyValueModelName = "KeyValue",
  ctx,
}: GetAWSCredentialsFromDBProps<C>): Promise<AWSCredentials | null> {
  const keyValueModel: Model<{ key: string; value: AWSCredentials }> =
    ctx.tx.db[ctxKeyValueModelName];
  const awsCredentials = await keyValueModel
    .findOne({ key: "awsCredentials" })
    .lean();

  return awsCredentials?.value ?? null;
}

function getAWSCredentialsFromEnv(prefix?: string): AWSCredentials | null {
  let accessKeyId = process.env.AWS_ACCESS_KEY;
  let secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
  let region = process.env.AWS_REGION;
  let sessionToken = process.env.AWS_SESSION_TOKEN;

  const upperCasePrefix = prefix?.toUpperCase();

  if (prefix) {
    accessKeyId =
      process.env[`${upperCasePrefix}_AWS_ACCESS_KEY`] ?? accessKeyId;
    secretAccessKey =
      process.env[`${upperCasePrefix}_AWS_SECRET_ACCESS_KEY`] ??
      secretAccessKey;
    region = process.env[`${upperCasePrefix}_AWS_REGION`] ?? region;
    sessionToken =
      process.env[`${upperCasePrefix}_AWS_SESSION_TOKEN`] ?? sessionToken;
  }

  if (!accessKeyId || !secretAccessKey || !region) {
    return null;
  }

  return { accessKeyId, secretAccessKey, region, sessionToken };
}

async function getAWSCredentials<C extends Context = Context>({
  ctxKeyValueModelName = "KeyValue",
  prefix,
  roleName,
  sessionName,
  rolePolicy,
  ctx,
}: GetAWSCredentialsProps<C>): Promise<AWSCredentials | null> {
  const dbCredentials = await getAWSCredentialsFromDB({
    ctxKeyValueModelName,
    ctx,
  });
  const envCredentials = getAWSCredentialsFromEnv(prefix);

  const roleToAssume = getRoleToAssume({ roleName, prefix });

  if (roleToAssume && envCredentials) {
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

export { getAWSCredentials, getAWSCredentialsFromDB, getAWSCredentialsFromEnv };
