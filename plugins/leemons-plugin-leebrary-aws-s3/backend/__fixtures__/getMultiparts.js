module.exports = function getMultiparts() {
  const multipartUploadModel = {
    id: 'multipart-upload-id',
    deploymentID: 'deployment-id',
    fileId: 'file-id',
    uploadId: 'upload-id',
  };
  const multipartEtagModel = {
    id: 'etag-id',
    deploymentID: 'deployment-id',
    fileId: 'file-id',
    etag: 'etag',
    partNumber: 1,
  };

  return { multipartUploadModel, multipartEtagModel };
};
