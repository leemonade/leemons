const multilanguage = leemons.getPlugin('multilanguage')?.services.contents.getProvider();

module.exports = async (_names, locale, { transacting } = {}) => {
  const names = (Array.isArray(_names) ? _names : [_names]).map((name) => name.trim());

  const keys = names.map((name) => leemons.plugin.prefixPN(`teaching.${name}`));
  const localizations = await multilanguage.getManyWithLocale(keys, locale, { transacting });

  return names.reduce((obj, name, i) => ({ ...obj, [name]: localizations[keys[i]] || null }), {});
};
