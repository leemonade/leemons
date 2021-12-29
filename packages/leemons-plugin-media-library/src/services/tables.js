const table = {
  files: leemons.query('plugins_media-library::files'),
  activeProvider: leemons.query('plugins_media-library::active-provider'),
  categories: leemons.query('plugins_media-library::categories'),
  fileCategories: leemons.query('plugins_media-library::files_categories'),
};

module.exports = table;
