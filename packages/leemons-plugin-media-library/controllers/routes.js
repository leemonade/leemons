module.exports = [
  /**
   * Files
   * */
  {
    path: '/upload',
    method: 'POST',
    handler: 'files.uploadFile',
    // authenticated: true,
    fileUpload: true,
  },
];
