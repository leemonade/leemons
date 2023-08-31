module.exports = function getMediaFileData() {
  const handleFileUploadInputs = {
    imageFileInput: {
      file: '1e7e65bf-7213-434a-9052-754a0f8634e1',
      assetName: 'test img',
      cover: undefined,
    },
    audioFileInput: {
      file: 'e1c7f210-da13-42a0-ac64-5d5bc16242bf',
      assetName: 'test audio',
      cover: '',
    },
  };

  handleFileUploadInputs.audioFileInput.cover = handleFileUploadInputs.imageFileInput.file;

  const data = {
    handleFileUploadInputs,
    imageFile: {
      id: handleFileUploadInputs.imageFileInput.file,
      provider: 'leebrary-aws-s3',
      type: 'image/jpeg',
      extension: 'jpeg',
      name: handleFileUploadInputs.imageFileInput.assetName,
      size: 3801,
      uri: `leemons/leebrary/${handleFileUploadInputs.imageFileInput.file}.jpeg`,
      isFolder: null,
      metadata: {
        size: '3.7 KB',
        format: 'JPEG',
        width: '300',
        height: '300',
      },
      deleted: 0,
      created_at: '2023-08-31T08:27:07.000Z',
      updated_at: '2023-08-31T08:27:07.000Z',
      deleted_at: null,
    },
    audioFile: {
      id: handleFileUploadInputs.audioFileInput.file,
      provider: 'leebrary-aws-s3',
      type: 'audio/mpeg',
      extension: 'mpga',
      name: handleFileUploadInputs.audioFileInput.assetName,
      size: 2988,
      uri: `leemons/leebrary/${handleFileUploadInputs.audioFileInput.file}.mpga`,
      isFolder: null,
      metadata: {
        size: '2.9 KB',
        format: 'MPEG audio',
        duration: '3:45',
        bitrate: '320.0 kbps',
      },
      deleted: 0,
      created_at: '2023-08-31T08:27:07.000Z',
      updated_at: '2023-08-31T08:27:07.000Z',
      deleted_at: null,
    },
  };

  return data;
};
