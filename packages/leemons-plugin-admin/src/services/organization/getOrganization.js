const _ = require('lodash');

async function getOrganization({ userSession } = {}) {
  const r = await leemons.getPlugin('users').services.platform.query({
    key_$in: [
      'platform-name',
      'platform-hostname',
      'platform-hostname-api',
      'platform-contact-phone',
      'platform-contact-name',
      'platform-contact-email',
      'platform-appearance-main-color',
      'platform-landscape-logo',
      'platform-square-logo',
      'platform-appearance-dark-mode',
      'platform-appearance-menu-main-color',
      'platform-appearance-menu-drawer-color',
      'platform-pictures-empty-states',
      'platform-email-logo',
      'platform-email-width-logo',
    ],
  });
  const v = _.keyBy(r, 'key');
  const organization = {
    name: v['platform-name']?.value,
    hostname: v['platform-hostname']?.value,
    hostnameApi: v['platform-hostname-api']?.value,
    logoUrl: v['platform-landscape-logo']?.value,
    squareLogoUrl: v['platform-square-logo']?.value,
    emailLogoUrl: v['platform-email-logo']?.value,
    emailWidthLogo: v['platform-email-width-logo']?.value
      ? _.parseInt(v['platform-email-width-logo']?.value)
      : v['platform-email-width-logo']?.value,
    mainColor: v['platform-appearance-main-color']?.value || '#3B76CC',
    email: userSession.email,
    contactPhone: v['platform-contact-phone']?.value,
    contactEmail: v['platform-contact-email']?.value,
    contactName: v['platform-contact-name']?.value,
    useDarkMode: ['true', '1'].includes(String(v['platform-appearance-dark-mode']?.value)),
    usePicturesEmptyStates: ['true', '1'].includes(
      String(v['platform-pictures-empty-states']?.value)
    ),
    menuMainColor: v['platform-appearance-menu-main-color']?.value || '#212B3D',
    menuDrawerColor: v['platform-appearance-menu-drawer-color']?.value || '#333F56',
  };
  return organization;
}

module.exports = getOrganization;
