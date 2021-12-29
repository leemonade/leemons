module.exports = [
  /**
   * Assets
   */
  {
    path: '/assets',
    method: 'POST',
    handler: 'assets.add',
    authenticated: true,
  },
  {
    path: '/assets/:id',
    method: 'DELETE',
    handler: 'assets.remove',
    authenticated: true,
  },
  /**
   * Files
   */
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

  /**
   * Categories
   */
  {
    path: '/categories',
    method: 'POST',
    handler: 'categories.register',
    authenticated: true,
  },
  {
    path: '/categories/exists/:name',
    method: 'GET',
    handler: 'categories.exists',
    authenticated: true,
  },
  {
    path: '/categories/list',
    method: 'GET',
    handler: 'categories.list',
    authenticated: true,
  },

  /**
   * Files Categories
   */
  {
    path: '/file/:id/category/:category',
    method: 'POST',
    handler: 'filesCategories.add',
    authenticated: true,
  },
  {
    path: '/file/:id/category/:category',
    method: 'DELETE',
    handler: 'filesCategories.remove',
    authenticated: true,
  },
  {
    path: '/file/:id/categories',
    method: 'GET',
    handler: 'filesCategories.get',
    authenticated: true,
  },
  {
    path: '/file/:id/category/:category',
    method: 'GET',
    handler: 'filesCategories.has',
    authenticated: true,
  },
  {
    path: '/category/:category/files',
    method: 'GET',
    handler: 'filesCategories.getFiles',
    authenticated: true,
  },
];
