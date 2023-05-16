const { table } = require('../tables');

async function setAppearanceDarkMode(darkMode, { transacting } = {}) {
  const value = {
    key: 'platform-appearance-dark-mode',
    value: darkMode,
  };

  return table.config.set({ key: 'platform-appearance-dark-mode' }, value, { transacting });
}

module.exports = setAppearanceDarkMode;
