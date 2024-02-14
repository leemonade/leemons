const { LeemonsMiddlewareAuthenticated } = require('@leemons/middlewares');
const { resolveLocales } = require('../../core/locale');
const {
  getLocalizations,
} = require('../../core/localization/global/getLocalizations/getLocalizations');

module.exports = {
  getLoggedRest: {
    rest: {
      method: 'POST',
      path: '/logged',
    },
    middlewares: [LeemonsMiddlewareAuthenticated({ continueEvenThoughYouAreNotLoggedIn: true })],
    async handler(ctx) {
      const { keys, keysStartsWith } = ctx.params;
      const [locale] = await resolveLocales({ ctx });

      return getLocalizations({ keys, keysStartsWith, locale, ctx });
    },
  },
  getRest: {
    rest: {
      method: 'POST',
      path: '/',
    },
    async handler(ctx) {
      const { keys, keysStartsWith, locale } = ctx.params;

      return getLocalizations({ keys, keysStartsWith, locale, ctx });
    },
  },
};
