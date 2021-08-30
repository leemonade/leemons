const platformService = require('../src/services/platform');

async function getDefaultLocale(ctx) {
  const locale = await platformService.getDefaultLocale();
  ctx.status = 200;
  ctx.body = { status: 200, locale };
}

async function getLocales(ctx) {
  const locales = await platformService.getLocales();
  ctx.status = 200;
  ctx.body = { status: 200, locales };
}

module.exports = {
  getDefaultLocale,
  getLocales,
};
