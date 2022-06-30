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
    ctx.status = 400;
    ctx.body = { status: 400, error: e.message };
  }
}

async function list(ctx) {
  try {
    const locales = await leemons.plugin.services.locales.getProvider().getAll();
    ctx.body = { locales };
  } catch (e) {
    ctx.status = 400;
    ctx.body = { status: 400, error: e.message };
  }
}

module.exports = {
  add,
  list,
};
