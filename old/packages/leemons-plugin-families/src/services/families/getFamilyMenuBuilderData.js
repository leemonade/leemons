async function getFamilyMenuBuilderData(family, familyName, { transacting } = {}) {
  const locale = await leemons
    .getPlugin('users')
    .services.platform.getDefaultLocale({ transacting });
  return {
    config: {
      key: `family-${family}`,
      pluginName: leemons.plugin.prefixPN(),
      parentKey: leemons.plugin.prefixPN('user-families'),
      url: `/families/private/detail/${family}`,
      label: {
        [locale]: familyName,
      },
    },
    permissions: [
      {
        permissionName: `plugins.families.family-${family}`,
        actionNames: ['view', 'admin'],
      },
    ],
  };
}

module.exports = { getFamilyMenuBuilderData };
