module.exports = [
  /**
   * Files
   * */
  {
    path: '/upload',
    method: 'POST',
    handler: 'files.uploadFile',
    authenticated: true,
  },
  {
    path: '/remove/:id',
    method: 'DELETE',
    handler: 'files.removeFile',
    authenticated: true,
  },
  {
    path: '/files/my',
    method: 'GET',
    handler: 'files.myFiles',
    authenticated: true,
  },
  {
    path: '/file/:id',
    method: 'GET',
    handler: 'files.file',
    authenticated: true,
  },
];
