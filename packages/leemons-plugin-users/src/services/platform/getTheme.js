const _ = require('lodash');
const query = require('./query');

async function getTheme({ transacting } = {}) {
  const r = await query(
    {
      key_$in: [
        'platform-appearance-main-color',
        'platform-appearance-menu-main-color',
        'platform-appearance-menu-drawer-color',
        'platform-appearance-dark-mode',
        'platform-landscape-logo',
        'platform-square-logo',
        'platform-pictures-empty-states',
      ],
    },
    { transacting }
  );
  const v = _.keyBy(r, 'key');
  return {
    logoUrl: v['platform-landscape-logo']?.value,
    squareLogoUrl: v['platform-square-logo']?.value,
    mainColor: v['platform-appearance-main-color']?.value || '#3B76CC',
    useDarkMode: ['true', '1'].includes(String(v['platform-appearance-dark-mode']?.value)),
    menuMainColor: v['platform-appearance-menu-main-color']?.value || '#3B76CC',
    menuDrawerColor: v['platform-appearance-menu-drawer-color']?.value || '#3B76CC',
    usePicturesEmptyStates: ['true', '1'].includes(
      String(v['platform-pictures-empty-states']?.value)
    ),
  };
}

module.exports = getTheme;
