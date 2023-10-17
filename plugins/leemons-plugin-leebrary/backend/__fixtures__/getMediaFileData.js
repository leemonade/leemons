/* eslint-disable sonarjs/no-duplicate-string */
module.exports = function getMediaFileData() {
  const handleFileUploadInputs = {
    imageFileInput: {
      file: '1e7e65bf-7213-434a-9052-754a0f8634e1',
      assetName: 'Tecnología de aprendizaje colaborativo para pedagogías activas',
      cover: undefined,
    },
    audioFileInput: {
      file: 'e1c7f210-da13-42a0-ac64-5d5bc16242bf',
      assetName: 'Audio test',
      cover: '',
    },
  };

  handleFileUploadInputs.audioFileInput.cover = handleFileUploadInputs.imageFileInput.file;

  return {
    handleFileUploadInputs,
    imageFile: {
      extension: 'png',
      id: handleFileUploadInputs.imageFileInput.file,
      isFolder: null,
      metadata: {
        size: '88.0 KB',
        format: 'PNG',
        width: '1024',
        height: '538',
      },
      name: handleFileUploadInputs.imageFileInput.assetName,
      provider: 'leebrary-aws-s3',
      size: 90101,
      type: 'image/png',
      uri: `leemons/leebrary/${handleFileUploadInputs.imageFileInput.file}.png`,
    },
    audioFile: {
      id: handleFileUploadInputs.audioFileInput.file,
      provider: 'leebrary-aws-s3',
      type: 'audio/mpeg',
      extension: 'mpga',
      name: handleFileUploadInputs.audioFileInput.assetName,
      size: 48136,
      uri: `leemons/leebrary/${handleFileUploadInputs.audioFileInput.file}.mpga`,
      isFolder: null,
      metadata: {
        size: '47.0 KB',
        format: 'MPEG Audio',
        duration: '0:01',
        bitrate: '320.0 kbps',
      },
    },
  };
};
