async function add(ctx) {
  const { code, name } = ctx.request.body;

  try {
    const locale = await leemons.plugin.services.locales.add(code, name);

    if (locale) {
      ctx.body = { locale };
      return;
    }

    ctx.body = { message: 'Locale already exists' };
  } catch (e) {
    ctx.body = { error: true };
  }
}

async function list(ctx) {
  try {
    const locales = await leemons.plugin.services.locales.getAll();
    ctx.body = { locales };
  } catch (e) {
    ctx.body = { error: true };
  }
}

module.exports = {
  add,
  list,
};
