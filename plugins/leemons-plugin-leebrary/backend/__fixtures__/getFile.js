module.exports = function getFile() {
  const file = {
    id: 'file-id',
    deploymentID: 'test-deployment-id',
    uri: '/file/id',
    type: 'application/pdf',
    extension: 'pdf',
    name: 'test-name',
    isFolder: false,
  };

  const folder = {
    id: 'file-id',
    deploymentID: 'test-deployment-id',
    uri: '/file/id',
    extension: 'zip',
    name: 'test-folder-name',
    isFolder: true,
  };

  const filePaths = [];
  const buffer = Buffer.from('test buffer');

  return { file, folder, filePaths, buffer };
};
