const _ = require('lodash');

module.exports = {
  get: async (ctx) => {
    try {
      const r = await leemons.getPlugin('users').services.platform.query({
        key_$in: [
          'platform-name',
          'platform-hostname',
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
        ],
      });
      const v = _.keyBy(r, 'key');
      ctx.status = 200;
      ctx.body = {
        status: 200,
        organization: {
          name: v['platform-name']?.value,
          hostname: v['platform-hostname']?.value,
          logoUrl: v['platform-landscape-logo']?.value,
          squareLogoUrl: v['platform-square-logo']?.value,
          mainColor: v['platform-appearance-main-color']?.value || '#3B76CC',
          email: ctx.state.userSession.email,
          contactPhone: v['platform-contact-phone']?.value,
          contactEmail: v['platform-contact-email']?.value,
          contactName: v['platform-contact-name']?.value,
          useDarkMode: ['true', '1'].includes(String(v['platform-appearance-dark-mode']?.value)),
          usePicturesEmptyStates: ['true', '1'].includes(
            String(v['platform-pictures-empty-states']?.value)
          ),
          menuMainColor: v['platform-appearance-menu-main-color']?.value || '#212B3D',
          menuDrawerColor: v['platform-appearance-menu-drawer-color']?.value || '#333F56',
        },
      };
    } catch (e) {
      console.error(e);
      ctx.status = 400;
      ctx.body = { status: 400, error: e.message };
    }
  },
  post: async (ctx) => {
    try {
      const { platform, users } = leemons.getPlugin('users').services;
      const { body } = ctx.request;
      const promises = [
        platform.setName(body.name),
        platform.setHostname(body.hostname),
        platform.setContactName(body.contactName),
        platform.setContactPhone(body.contactPhone),
        platform.setContactEmail(body.contactEmail),
        platform.setAppearanceDarkMode(['true', '1'].includes(String(body.useDarkMode))),
        platform.setPicturesEmptyStates(
          ['true', '1'].includes(String(body.usePicturesEmptyStates))
        ),
        platform.setAppearanceMainColor(body.mainColor),
        platform.setAppearanceMenuMainColor(body.menuMainColor),
        platform.setAppearanceMenuDrawerColor(body.menuDrawerColor),
        platform.setLandscapeLogo(body.logoUrl),
        platform.setSquareLogo(body.squareLogoUrl),
        users.updateEmail(ctx.state.userSession.id, body.email),
      ];
      if (body.password) {
        promises.push(users.updatePassword(ctx.state.userSession.id, body.password));
      }
      await Promise.all(promises);
      ctx.status = 200;
      ctx.body = {
        status: 200,
      };
    } catch (e) {
      console.error(e);
      ctx.status = 400;
      ctx.body = { status: 400, error: e.message };
    }
  },
};
