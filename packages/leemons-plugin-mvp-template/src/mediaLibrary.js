const config = require('../config/awsS3Config');

async function addAWSS3AsProvider() {
  await leemons
    .getPlugin('media-library')
    .services.config.setProviderConfig('media-library-aws-s3', config);
}

module.exports = addAWSS3AsProvider;
