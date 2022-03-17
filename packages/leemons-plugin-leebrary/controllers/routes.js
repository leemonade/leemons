module.exports = [
  /**
   * Tags
   */
  ...leemons.getPlugin('common').services.tags.getRoutes('tags', {
    authenticated: true,
    allowedPermissions: {
      'plugins.leebrary.library': {
        actions: ['update', 'create', 'delete', 'admin'],
      },
    },
  }),
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
  {
    path: '/assets/:id',
    method: 'PUT',
    handler: 'assets.update',
    authenticated: true,
  },
  {
    path: '/assets/my',
    method: 'GET',
    handler: 'assets.my',
    authenticated: true,
  },
  /*
  {
    path: '/assets/:id/files/:file',
    method: 'POST',
    handler: 'assets.addFile',
    authenticated: true,
  },
  {
    path: '/assets/:id/files/:file',
    method: 'DELETE',
    handler: 'assets.unlinkFile',
    authenticated: true,
  },
  {
    path: '/assets/:id/files',
    method: 'GET',
    handler: 'assets.getFiles',
    authenticated: true,
  },
  */
  /**
   * Files
   */
  /*
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
  */
  {
    path: '/file/:id',
    method: 'GET',
    handler: 'files.file',
    authenticated: true,
  },

  /**
   * Categories
   */
  /*
  {
    path: '/categories',
    method: 'POST',
    handler: 'categories.add',
    authenticated: true,
  },
  {
    path: '/categories/:key',
    method: 'DELETE',
    handler: 'categories.remove',
    authenticated: true,
  },
  {
    path: '/categories/exists/:key',
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
  */
  {
    path: '/categories/menu-list',
    method: 'GET',
    handler: 'categories.listWithMenuItem',
    authenticated: true,
  },
  /**
   * Assets Categories
   */
  /*
  {
    path: '/asset/:id/category/:category',
    method: 'POST',
    handler: 'assetsCategories.add',
    authenticated: true,
  },
  {
    path: '/asset/:id/category/:category',
    method: 'DELETE',
    handler: 'assetsCategories.remove',
    authenticated: true,
  },
  {
    path: '/asset/:id/categories',
    method: 'GET',
    handler: 'assetsCategories.get',
    authenticated: true,
  },
  {
    path: '/asset/:id/category/:category',
    method: 'GET',
    handler: 'assetsCategories.has',
    authenticated: true,
  },
  */
  {
    path: '/category/:category/assets',
    method: 'GET',
    handler: 'assetsCategories.getByCategory',
    authenticated: true,
  },
  /**
   * Permissions
   */
  /*
  {
    path: '/asset/:asset/permissions',
    method: 'POST',
    handler: 'permissions.set',
    authenticated: true,
  },
  {
    path: '/asset/:asset/permissions',
    method: 'DELETE',
    handler: 'permissions.remove',
    authenticated: true,
  },
  {
    path: '/asset/:asset/permissions',
    method: 'GET',
    handler: 'permissions.get',
    authenticated: true,
  },
  {
    path: '/asset/:asset/permissions/has',
    method: 'GET',
    handler: 'permissions.has',
    authenticated: true,
  },
  {
    path: '/asset/:asset/permissions/users',
    method: 'GET',
    handler: 'permissions.list',
    authenticated: true,
  },
  */
  /**
   * Search
   */
  {
    path: '/search',
    method: 'GET',
    handler: 'search.search',
    authenticated: true,
  },
];
