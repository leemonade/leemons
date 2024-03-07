const { isEmpty, isString } = require('lodash');
const { LeemonsError } = require('@leemons/error');
const findOne = require('./findOne');
const update = require('./update');

/**
 * @public
 * @static
 * @return {Promise<any>}
 * */
async function setDefaultLanguage({ lang, ctx } = {}) {
  if (!lang || !isString(lang) || isEmpty(lang)) {
    throw new LeemonsError(ctx, { message: 'Language is required' });
  }

  const currentSettings = await findOne({ ctx });
  if (currentSettings && currentSettings.configured) {
    throw new LeemonsError(ctx, { message: 'Settings already configured' });
  }

  await ctx.tx.call('users.platform.setDefaultLocale', { value: lang });

  return update({
    ...(currentSettings || {}),
    lang,
    ctx,
  });
}

module.exports = setDefaultLanguage;
