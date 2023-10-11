module.exports = function getFile() {
  const file = {
    id: 'file-id',
    url: '/file/id',
    extension: 'png',
    isFolder: false,
  };

  const folder = {
    id: 'file-id',
    url: '/file/id',
    extension: 'zip',
    isFolder: true,
  };

  const filePaths = [];

  return { file, folder, filePaths };
};
