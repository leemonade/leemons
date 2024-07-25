const { LeemonsError } = require('@leemons/error');

/**
 *
 * @param {object} props
 * @param {{
 *  accessKeyId: string,
 *  secretAccessKey: string,
 *  region: string
 * }} props.credentials
 * @param {string} props.ctxKeyValueModelName
 * @param {import("@leemons/deployment-manager").Context} props.ctx
 */
async function saveAWSCredentials({ credentials, ctxKeyValueModelName = 'KeyValue', ctx }) {
  const { accessKeyId, secretAccessKey, region } = credentials;
  const keyValueModel = ctx.db[ctxKeyValueModelName];

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

module.exports = saveAWSCredentials;
