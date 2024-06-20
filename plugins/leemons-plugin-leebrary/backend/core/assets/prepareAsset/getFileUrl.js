const { isString } = require('lodash');
const { getByName: getProviderByName } = require('../../providers/getByName');

async function getFileUrl({
  fileID,
  provider,
  uri,
  segment,
  isPublic = false,
  signedURLExpirationTime = null,
  ctx,
}) {
  if (!isString(fileID)) {
    return '';
  }
  if (fileID.startsWith('http')) {
    return fileID;
  }

  if (provider === 'sys') {
    const authTokens = ctx.meta.authorization;
    const urlSuffixSegment = segment ? `/${segment}` : '';
    const authParam = !isPublic ? `?authorization=${encodeURIComponent(authTokens)}` : '';
    return `${process.env.API_URL}/api/v1/leebrary/file/${
      isPublic ? 'public/' : ''
    }${fileID}${urlSuffixSegment}${authParam}`;
  }

  let signedUrl = null;
  const providerService = await getProviderByName({ name: provider, ctx });
  if (providerService?.supportedMethods?.getReadStream) {
    signedUrl = await ctx.tx.call(`${provider}.files.getReadStream`, {
      key: uri,
      forceStream: false,
      expirationTime: signedURLExpirationTime,
    });
  }
  return signedUrl;
}

module.exports = { getFileUrl };
