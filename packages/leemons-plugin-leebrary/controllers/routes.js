module.exports = [
  // ························································
  // Tags
  ...leemons.getPlugin('common').services.tags.getRoutes('tags', {
    authenticated: true,
    allowedPermissions: {
      'plugins.leebrary.library': {
        actions: ['update', 'create', 'delete', 'admin'],
      },
    },
  }),
  // ························································
  // Assets
  {
    path: '/assets',
    method: 'POST',
    handler: 'assets.add',
    authenticated: true,
  },
  {
    path: '/assets/list',
    method: 'POST',
    handler: 'assets.listByIds',
    authenticated: true,
  },
  {
    path: '/assets/list',
    method: 'GET',
    handler: 'assets.list',
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
    path: '/assets/pins',
    method: 'POST',
    handler: 'assets.addPin',
    authenticated: true,
  },
  {
    path: '/assets/pins',
    method: 'GET',
    handler: 'assets.pins',
    authenticated: true,
  },
  {
    path: '/assets/has-pins',
    method: 'GET',
    handler: 'assets.hasPins',
    authenticated: true,
  },
  {
    path: '/assets/:id',
    method: 'POST',
    handler: 'assets.duplicate',
    authenticated: true,
  },
  {
    path: '/assets/my',
    method: 'GET',
    handler: 'assets.my',
    authenticated: true,
  },
  {
    path: '/assets/url-metadata',
    method: 'GET',
    handler: 'assets.urlMetadata',
    authenticated: true,
  },
  {
    path: '/assets/pins/:id',
    method: 'DELETE',
    handler: 'assets.removePin',
    authenticated: true,
  },
  {
    path: '/assets/:id',
    method: 'GET',
    handler: 'assets.get',
    authenticated: true,
    xapi: {
      verb: 'access',
      object: 'params.id',
    },
  },
  // ························································
  // Files
  {
    path: '/file/multipart/new',
    method: 'POST',
    handler: 'files.newMultipart',
    authenticated: true,
  },
  {
    path: '/file/multipart/chunk',
    method: 'POST',
    handler: 'files.uploadMultipartChunk',
    authenticated: true,
  },
  {
    path: '/file/multipart/abort',
    method: 'POST',
    handler: 'files.abortMultipart',
    authenticated: true,
  },
  {
    path: '/file/multipart/finish',
    method: 'POST',
    handler: 'files.finishMultipart',
    authenticated: true,
  },
  {
    path: '/file/public/:id',
    method: 'GET',
    handler: 'files.publicFile',
  },
  {
    path: '/file/public/:id/(.*)',
    method: 'GET',
    handler: 'files.publicFolder',
  },
  {
    path: '/file/:id',
    method: 'GET',
    handler: 'files.file',
    authenticated: true,
  },
  {
    path: '/file/:id/(.*)',
    method: 'GET',
    handler: 'files.folder',
    authenticated: true,
  },
  {
    path: '/img/:assetId',
    method: 'GET',
    handler: 'files.cover',
    authenticated: {
      nextWithoutSession: true,
    },
  },
  // ························································
  // Categories
  {
    path: '/categories/menu-list',
    method: 'GET',
    handler: 'categories.listWithMenuItem',
    authenticated: true,
  },
  {
    path: '/categories/:id/types',
    method: 'GET',
    handler: 'categories.assetTypes',
    authenticated: true,
  },
  // ························································
  // Permissions
  {
    path: '/asset/:asset/permissions',
    method: 'POST',
    handler: 'permissions.set',
    authenticated: true,
  },
  // ························································
  // Search
  {
    path: '/search',
    method: 'GET',
    handler: 'search.search',
    authenticated: true,
  },
  // ························································
  // Providers
  {
    path: '/providers',
    method: 'GET',
    handler: 'providers.list',
    authenticated: true,
  },
  {
    path: '/providers/config/delete',
    method: 'POST',
    handler: 'providers.deleteConfig',
    authenticated: true,
  },
  {
    path: '/providers/config',
    method: 'POST',
    handler: 'providers.setConfig',
    authenticated: true,
  },
];
