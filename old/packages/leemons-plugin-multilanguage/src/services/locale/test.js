/* eslint-disable no-console */

const localizationsTable = leemons.query('plugins_multilanguage::localizations');
const localesTable = leemons.query('plugins_multilanguage::locales');

const Locales = require('.');

module.exports = async () => {
  const locales = new Locales({ model: localesTable });

  leemons.log.debug('Initializing Locales test');
  leemons.log.debug('This must be moved to jest', { labels: ['warning'] });

  await localizationsTable.deleteMany({ id_$null: false });
  await localesTable.deleteMany({ id_$null: false });

  function space() {
    console.log();
    console.log('==================');
    console.log();
  }

  try {
    console.log(`locales.add('es', 'Esñapol')`);
    const locale = await locales.add('es', 'Esñapol');
    console.log(locale);
  } catch (e) {
    console.error(e);
  }
  space();

  try {
    console.log(
      `locales.addMany([['es-ES', 'Español de España'], ['en', 'English'], ['en-UK', 'English UK']])`
    );
    const locale = await locales.addMany([
      ['es-ES', 'Español de España'],
      ['en', 'English'],
      ['en-UK', 'English UK'],
    ]);
    console.log(locale);
  } catch (e) {
    console.error(e);
  }
  space();

  try {
    console.log(`locales.setName('es', 'Español')`);
    const locale = await locales.setName('es', 'Español');
    console.log(locale);
  } catch (e) {
    console.error(e);
  }
  space();

  try {
    console.log(`locales.has('es')`);
    const locale = await locales.has('es');
    console.log(locale);
  } catch (e) {
    console.error(e);
  }
  space();

  try {
    console.log(`locales.hasMany(['es', 'es-ES', 'en', 'en-UK', 'it'])`);
    const locale = await locales.hasMany(['es', 'es-ES', 'en', 'en-UK', 'it']);
    console.log(locale);
  } catch (e) {
    console.error(e);
  }
  space();

  try {
    console.log(`locales.get('es')`);
    const locale = await locales.get('es');
    console.log(locale);
  } catch (e) {
    console.error(e);
  }
  space();

  try {
    console.log(`locales.getMany(['es', 'es-ES', 'it'])`);
    const locale = await locales.getMany(['es', 'es-ES', 'it']);
    console.log(locale);
  } catch (e) {
    console.error(e);
  }
  space();

  try {
    console.log(`locales.getAll()`);
    const locale = await locales.getAll();
    console.log(locale);
  } catch (e) {
    console.error(e);
  }
  space();

  try {
    console.log(`locales.delete('es')`);
    const locale = await locales.delete('es');
    console.log(locale);
  } catch (e) {
    console.error(e);
  }
  space();

  try {
    console.log(`locales.deleteMany(['es-ES', 'it', 'en', 'en-UK'])`);
    const locale = await locales.deleteMany(['es-ES', 'it', 'en', 'en-UK']);
    console.log(locale);
  } catch (e) {
    console.error(e);
  }
  space();
};
