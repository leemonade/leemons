const { getByName: getProviderByName } = require('../../providers/getByName');

async function getUploadChunkUrls({ fileId, nChunks, path, ctx } = {}) {
  const file = await ctx.tx.db.Files.findOne({ id: fileId }).lean();
  if (!file) throw new Error('No file found');

  if (file.provider !== 'sys') {
    const provider = await getProviderByName({ name: file.provider, ctx });
    if (provider?.supportedMethods?.getUploadChunkUrls) {
      return ctx.tx.call(`${file.provider}.files.getUploadChunkUrls`, {
        file,
        nChunks,
        path,
      });
    }
  }

  return [];
}

module.exports = { getUploadChunkUrls };
