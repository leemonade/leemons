async function getFamilyMenuBuilderData({ family, familyName, ctx }) {
  const locale = await ctx.tx.call('users.platform.getDefaultLocale');
  return {
    item: {
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
        permissionName: `families.family-${family}`,
        actionNames: ['view', 'admin'],
      },
    ],
    isCustomPermission: true,
  };
}

module.exports = { getFamilyMenuBuilderData };
