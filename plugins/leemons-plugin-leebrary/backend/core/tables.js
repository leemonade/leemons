const tables = {
  settings: leemons.query('plugins_leebrary::settings'),
  assets: leemons.query('plugins_leebrary::assets'),
  files: leemons.query('plugins_leebrary::files'),
  assetsFiles: leemons.query('plugins_leebrary::assets-files'),
  assetsSubjects: leemons.query('plugins_leebrary::assets-subjects'),
  categories: leemons.query('plugins_leebrary::categories'),
  bookmarks: leemons.query('plugins_leebrary::bookmarks'),
  pins: leemons.query('plugins_leebrary::pins'),
};

module.exports = { tables };
