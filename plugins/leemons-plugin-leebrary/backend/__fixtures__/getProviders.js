module.exports = function getProviders() {
  const provider = {
    deploymentID: 'auto-deployment-id',
    key: '_providers_',
    value: {
      pluginName: 'leebrary-aws-s3',
      params: {
        name: 'Amazon S3',
        supportedMethods: {
          uploadMultipartChunk: true,
          finishMultipart: true,
          abortMultipart: true,
          getS3AndConfig: true,
          getReadStream: true,
          removeConfig: true,
          newMultipart: true,
          getConfig: true,
          setConfig: true,
          upload: true,
          remove: true,
          clone: true,
        },
      },
    },
  };

  return {
    provider,
  };
};
