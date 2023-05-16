const path = require('path');
const fs = require('fs/promises');

module.exports = {
  getLang: async (ctx) => {
    const { page, lang } = ctx.params;
    try {
      const localeData = await fs.readFile(
        path.resolve(__dirname, `../src/i18n/${lang}.json`),
        'utf8'
      );
      const locale = JSON.parse(localeData);
      ctx.status = 200;
      ctx.body = { status: 200, data: { [lang]: { [page]: locale[page] } } };
    } catch (e) {
      ctx.status = 400;
      ctx.body = { status: 400, error: e.message };
    }
  },
};
