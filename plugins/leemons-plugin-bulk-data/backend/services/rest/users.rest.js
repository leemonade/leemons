const { LeemonsError } = require('@leemons/error');

module.exports = {
  initSuperRest: {
    rest: {
      path: '/init-super',
      method: 'POST',
    },
    async handler(ctx) {
      if (process.env.NODE_ENV !== 'production') {
        try {
          await ctx.call('admin.settings.setLanguages', {
            langs: { code: 'es', name: 'Español' },
            defaultLang: 'es',
          });
          await ctx.call('admin.settings.registerAdmin', {
            email: 'super@leemons.io',
            password: ctx.params.pass,
            locale: 'es',
            name: 'Super',
            surnames: 'Admin',
            gender: 'female',
            birthdate: new Date(),
          });
          await ctx.call('admin.settings.update', {
            status: 'INSTALLED',
            configured: true,
          });

          return { status: 200 };
        } catch (e) {
          throw new LeemonsError(ctx, { message: e.message, httpStatusCode: 500 });
        }
      } else {
        throw new LeemonsError(ctx, { message: 'Endpoint disabled', httpStatusCode: 401 });
      }
    },
  },
};
