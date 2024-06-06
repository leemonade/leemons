const hash = require('object-hash');

const commonNamespace = 'common.localizations';
const globalNamespace = 'global.localizations';

const getCommonCacheKey = ({ ctx, locale: _locale, keys, keysStartsWith }) => {
  const locale = Array.isArray(_locale) ? _locale.sort().join(',') : _locale;
  const keysHash = hash(keys || []);
  const keysStartsWithHash = hash(keysStartsWith || []);

  return `${commonNamespace}:${ctx.meta.deploymentID}:${locale}:${keysHash}:${keysStartsWithHash}`;
};

const getGlobalCacheKey = ({ ctx, locale: _locale, keys, keysStartsWith }) => {
  const locale = Array.isArray(_locale) ? _locale.sort().join(',') : _locale;
  const keysHash = keys ? hash(keys) : null;
  const keysStartsWithHash = keysStartsWith ? hash(keysStartsWith) : null;

  if (keysHash) {
    return `${globalNamespace}:${ctx.meta.deploymentID}:${locale}:keys.${keysHash}`;
  }

  return `${globalNamespace}:${ctx.meta.deploymentID}:${locale}:keysStartsWith.${keysStartsWithHash}`;
};

module.exports = {
  commonNamespace,
  globalNamespace,

  getCommonCacheKey,
  getGlobalCacheKey,
};
