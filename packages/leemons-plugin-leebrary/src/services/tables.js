const tables = {
  settings: leemons.query('plugins_leebrary::settings'),
  assets: leemons.query('plugins_leebrary::assets'),
  files: leemons.query('plugins_leebrary::files'),
  assetsFiles: leemons.query('plugins_leebrary::assets-files'),
  categories: leemons.query('plugins_leebrary::categories'),
  assetCategories: leemons.query('plugins_leebrary::assets-categories'),
  permissions: leemons.query('plugins_leebrary::users-permissions'),
};

module.exports = { tables };
