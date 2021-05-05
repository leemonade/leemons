const postsTable = leemons.query('plugins_user-admin::posts');
console.log(process.env);

async function create(ctx) {
  const { title, body, author } = ctx.request.body;

  if (title && body && author) {
    try {
      const post = await postsTable.create({ title, body, author });
      ctx.body = { msg: 'The post has been created', post };
    } catch (e) {
      ctx.body = { msg: `The post can't be created` };
    }
  } else {
    ctx.body = { msg: `You must provide a title, body and author` };
  }
}

async function read(ctx) {
  const { id } = ctx.request.params;

  const post = await postsTable.findOne({ id });

  if (post) {
    ctx.body = { msg: 'The post has been found', post };
  } else {
    ctx.body = { msg: `The post can't be found` };
  }
}

async function update(ctx) {
  const { id } = ctx.request.params;
  const { title, body } = ctx.request.body;

  if (title || body) {
    const updatedObject = {};

    if (title) updatedObject.title = title;
    if (body) updatedObject.body = body;

    try {
      const post = await postsTable.update({ id }, updatedObject);
      ctx.body = { msg: 'The post has been updated', post };
    } catch (e) {
      ctx.body = { msg: `The post can't be updated` };
    }
  } else {
    ctx.body = { msg: `You must provide a title or body` };
  }
}

async function deletePost(ctx) {
  const { id } = ctx.request.params;

  try {
    await postsTable.delete({ id });

    ctx.body = { msg: 'The post has been deleted' };
  } catch (e) {
    ctx.body = { msg: `The post can't be deleted` };
  }
}

async function userPosts(ctx) {
  const { id } = ctx.request.params;

  const posts = await postsTable.find({ author: id });

  if (posts.length) {
    ctx.body = { msg: `The user have ${posts.length} posts`, posts };
  } else {
    ctx.body = { msg: 'The user does not have any posts' };
  }
}

module.exports = {
  create,
  read,
  update,
  delete: deletePost,
  userPosts,
};
