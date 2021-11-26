const { getConfig } = require('./getConfig');

async function getS3AndConfig({ transacting } = {}) {
  const config = await getConfig({ transacting });
  if (config) {
    return {
      s3: new global.utils.aws.S3({
        accessKeyId: config.accessKey.trim(),
        secretAccessKey: config.secretAccessKey.trim(),
        region: config.region.trim(),
      }),
      config,
    };
  }
  return null;
}

module.exports = { getS3AndConfig };
