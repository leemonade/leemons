const _ = require('lodash');
const query = require('./query');

async function getTheme({ transacting } = {}) {
  const r = await query(
    {
      key_$in: ['platform-appearance-main-color', 'platform-appearance-logo'],
    },
    { transacting }
  );
  const v = _.keyBy(r, 'key');
  return {
    logoUrl: v['platform-appearance-logo']?.value,
    mainColor: v['platform-appearance-main-color']?.value || '#3B76CC',
  };
}

module.exports = getTheme;
