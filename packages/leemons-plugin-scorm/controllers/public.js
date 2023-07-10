const { createReadStream } = require('fs');
const path = require('path');
const sendFile = require('koa-sendfile');

module.exports = {
  serveFile: async (ctx) => {
    const { filePath } = ctx.params;

    const publicPath = path.resolve(__dirname, '../public');
    const absolutePath = path.resolve(publicPath, filePath);

    const relative = path.relative(publicPath, absolutePath);
    const isInside = relative && !relative.startsWith('..') && !path.isAbsolute(relative);

    if (!isInside) {
      ctx.status = 404;
    } else {
      try {
        await sendFile(ctx, absolutePath);
      } catch (e) {
        console.log(e);
      }
    }
  },
};
