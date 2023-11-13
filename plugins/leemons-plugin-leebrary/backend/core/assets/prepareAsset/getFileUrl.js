const { isString } = require('lodash');
const { getByName: getProviderByName } = require('../../providers/getByName');

async function getFileUrl({ fileID, provider, uri, segment, isPublic = false, ctx }) {
  if (!isString(fileID)) {
    return '';
  }

  if (fileID.startsWith('http')) {
    return fileID;
  }

  // ! Si hacemos toodo aquí (pasar la el dato de la cookie desde front end),
  // ! podemos garantizar que el asset estará realmente preparado.
  // ! De lo contrario, podríamos tener falsos positivos si un asset tiene recursos
  // ! de provedores sys y provedores no sys a la vez

  const authTokens = ctx.meta.authorization; // ! Cuidado aquí, esto en el frontend viene de la cookie. TODO!
  const urlSuffixSegment = segment ? `/${segment}` : '';
  const authParam = !isPublic ? `?authorization=${encodeURIComponent(authTokens)}` : '';

  if (provider === 'sys') {
    return `${leemons.apiUrl}/api/v1/leebrary/file/${
      isPublic ? 'public/' : ''
    }${fileID}${urlSuffixSegment}${authParam}`;
  }

  let signedUrl = null;
  const providerService = await getProviderByName({ name: provider, ctx });
  if (providerService?.supportedMethods?.getReadStream) {
    signedUrl = await ctx.tx.call(`${provider}.files.getReadStream`, {
      key: uri,
      forceStream: false,
    });
  }
  return signedUrl;
}

module.exports = { getFileUrl };
