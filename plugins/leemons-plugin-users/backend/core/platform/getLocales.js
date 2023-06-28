/**
 * Return all platform locales
 * @public
 * @static
 * @param {any} transacting - DB Transaction
 * @return {Promise<any>}
 * */
async function getLocales({ ctx }) {
  return ctx.tx.call('multilanguage.locales.getAll');
}

module.exports = getLocales;
