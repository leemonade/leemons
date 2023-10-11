const { LeemonsError } = require('@leemons/error');

async function uploadFiles({ ctx }) {
  throw new LeemonsError(ctx, { message: 'Method not implemented.', httpStatusCode: 501 });
}

module.exports = { uploadFiles };
