const table = {
  files: leemons.query('plugins_media-library::files'),
  activeProvider: leemons.query('plugins_media-library::active-provider'),
};

module.exports = { table };
