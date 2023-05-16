const { table } = require('../tables');

async function setPicturesEmptyStates(usePictures, { transacting } = {}) {
  const value = {
    key: 'platform-pictures-empty-states',
    value: usePictures,
  };

  return table.config.set({ key: 'platform-pictures-empty-states' }, value, { transacting });
}

module.exports = setPicturesEmptyStates;
