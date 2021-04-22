module.exports = [
  {
    path: '/user',
    method: 'POST',
    handler: 'users.register',
  },
  {
    path: '/user/:id',
    method: 'GET',
    handler: 'users.publicInfo',
  },
  {
    path: '/users',
    method: 'GET',
    handler: 'users.allUsers',
  },
  {
    path: '/login',
    method: 'POST',
    handler: 'users.login',
  },

  {
    path: '/user/:id/posts',
    method: 'GET',
    handler: 'posts.userPosts',
  },
  {
    path: '/post',
    method: 'POST',
    handler: 'posts.create',
  },
  {
    path: '/post/:id',
    method: 'GET',
    handler: 'posts.read',
  },
  {
    path: '/post/:id',
    method: 'PATCH',
    handler: 'posts.update',
  },
  {
    path: '/post/:id',
    method: 'DELETE',
    handler: 'posts.delete',
  },
];
