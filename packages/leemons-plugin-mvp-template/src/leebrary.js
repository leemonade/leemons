const config = require('../config/awsS3Config');

async function addAWSS3AsProvider() {
  await leemons.getPlugin('leebrary').services.config.setProviderConfig('leebrary-aws-s3', config);
}

module.exports = addAWSS3AsProvider;
