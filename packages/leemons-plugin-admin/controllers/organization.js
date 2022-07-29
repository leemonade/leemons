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
          'platform-appearance-logo',
        ],
      });
      const v = _.keyBy(r, 'key');
      ctx.status = 200;
      ctx.body = {
        status: 200,
        organization: {
          name: v['platform-name']?.value,
          hostname: v['platform-hostname']?.value,
          logoUrl: v['platform-appearance-logo']?.value,
          mainColor: v['platform-appearance-main-color']?.value || '#3B76CC',
          email: ctx.state.userSession.email,
          contactPhone: v['platform-contact-phone']?.value,
          contactEmail: v['platform-contact-email']?.value,
          contactName: v['platform-contact-name']?.value,
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
        platform.setAppearanceMainColor(body.mainColor),
        platform.setAppearanceLogo(body.logoUrl),
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
