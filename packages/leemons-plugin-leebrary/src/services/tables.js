const table = {
  assets: leemons.query('plugins_leebrary::assets'),
  files: leemons.query('plugins_leebrary::files'),
  assetsFiles: leemons.query('plugins_leebrary::assets_files'),
  activeProvider: leemons.query('plugins_leebrary::active-provider'),
  categories: leemons.query('plugins_leebrary::categories'),
  assetCategories: leemons.query('plugins_leebrary::assets_categories'),
  assetTags: leemons.query('plugins_leebrary::assets_tags'),
  permissions: leemons.query('plugins_leebrary::users_permissions'),
};

module.exports = table;
