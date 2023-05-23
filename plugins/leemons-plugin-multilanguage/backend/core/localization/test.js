/* eslint-disable no-console */

const localizationsTable = leemons.query('plugins_multilanguage::localizations');
const localesTable = leemons.query('plugins_multilanguage::locales');

const LocalesProvider = require('../locale');
const LocalizationsProvider = require('.');

module.exports = async () => {
  const locales = new LocalesProvider({ model: localesTable });
  const localizations = new LocalizationsProvider({ model: localizationsTable });

  leemons.log.debug('Initializing Localizations test');
  leemons.log.debug('This must be moved to jest', { labels: ['warning'] });

  try {
    await localizationsTable.deleteMany({ id_$null: false });
    await localesTable.deleteMany({ id_$null: false });
  } catch (e) {
    console.log(e);
  }

  await locales.addMany([
    ['es', 'Español'],
    ['es-ES', 'Español de España'],
    ['en', 'English'],
  ]);

  function space() {
    console.log();
    console.log('==================');
    console.log();
  }

  try {
    console.log(`localizations.add('config.name', 'es', 'Nombre')`);
    const locale = await localizations.add('config.name', 'es', 'Nombre');
    console.log(locale);
  } catch (e) {
    console.error(e);
  }
  space();

  try {
    console.log(`localizations.addMany([
      ['config.name', 'es', 'Nombre'],
      ['config.name', 'es-ES', 'Nombre'],
      ['config.name', 'en', 'Name'],
    ]);`);
    const locale = await localizations.addMany({
      es: {
        'config.name': 'Nombre',
        'config.test': 'Test',
      },
      en: {
        'config.name': 'Name',
        'config.test': 'Test',
      },
    });
    console.log(locale);
  } catch (e) {
    console.error(e);
  }
  space();

  try {
    console.log(`localizations.addManyByKey('config.settings', {
      'es': 'Configuración',
      'es-ES': 'Configuración',
      'en': 'Settings'
    })`);
    const locale = await localizations.addManyByKey('config.settings', {
      es: 'Configuración',
      'es-ES': 'Configuración',
      en: 'Settings',
    });
    console.log(locale);
  } catch (e) {
    console.error(e);
  }
  space();

  try {
    console.log(`localizations.countKeyStartsWith('config', 'en')`);
    const locale = await localizations.countKeyStartsWith('config', 'en');
    console.log(locale);
  } catch (e) {
    console.error(e);
  }
  space();

  try {
    console.log(`localizations.countLocalesWithKey('config.name')`);
    const locale = await localizations.countLocalesWithKey('config.name');
    console.log(locale);
  } catch (e) {
    console.error(e);
  }
  space();

  try {
    console.log(`localizations.setKey('config.name', {
      es: 'El Nombre',
      en: 'The name',
    })`);
    const locale = await localizations.setKey('config.name', {
      es: 'El Nombre',
      en: 'The name',
    });
    console.log(locale);
  } catch (e) {
    console.error(e);
  }
  space();

  try {
    console.log(`localizations.setMany({
      es: {
        'config.fov': 'Campo de Visión',
      },
      en: {
        'config.fov': 'Field of View',
      },
    })`);
    const locale = await localizations.setMany({
      es: {
        'config.fov': 'Campo de Visión',
      },
      en: {
        'config.fov': 'Field of View',
      },
    });
    console.log(locale);
  } catch (e) {
    console.error(e);
  }
  space();

  try {
    console.log(`localizations.setValue('config.name', 'es-ES', 'nombre')`);
    const locale = await localizations.setValue('config.name', 'es-ES', 'nombre');
    console.log(locale);
  } catch (e) {
    console.error(e);
  }
  space();

  try {
    console.log(`localizations.get('config.name', 'es-ES', 'nombre')`);
    const locale = await localizations.get('config.name', 'es-ES', 'nombre');
    console.log(locale);
  } catch (e) {
    console.error(e);
  }
  space();

  try {
    console.log(`localizations.getWithKey('config.name')`);
    const locale = await localizations.getWithKey('config.name');
    console.log(locale);
  } catch (e) {
    console.error(e);
  }
  space();

  try {
    console.log(`localizations.getKeyStartsWith('config', 'es')`);
    const locale = await localizations.getKeyStartsWith('config', 'es');
    console.log(locale);
  } catch (e) {
    console.error(e);
  }
  space();

  try {
    console.log(`localizations.getKeyValueStartsWith('config', 'es')`);
    const locale = await localizations.getKeyValueStartsWith('config', 'es');
    console.log(locale);
  } catch (e) {
    console.error(e);
  }
  space();

  try {
    console.log(`localizations.getWithLocale('es-ES')`);
    const locale = await localizations.getWithLocale('es-ES');
    console.log(locale);
  } catch (e) {
    console.error(e);
  }
  space();

  try {
    console.log(`localizations.getKeyValueWithLocale('es')`);
    const locale = await localizations.getKeyValueWithLocale('es');
    console.log(locale);
  } catch (e) {
    console.error(e);
  }
  space();

  try {
    console.log(`localizations.delete('config.name', 'es')`);
    const locale = await localizations.delete('config.name', 'es');
    console.log(locale);
  } catch (e) {
    console.error(e);
  }
  space();

  try {
    console.log(`localizations.localizations.deleteMany([
      ['config.name', 'en'],
      ['config.name', 'es-ES'],
    ])`);
    const locale = await localizations.deleteMany([
      ['config.name', 'en'],
      ['config.name', 'es-ES'],
    ]);
    console.log(locale);
  } catch (e) {
    console.error(e);
  }
  space();

  try {
    console.log(`localizations.deleteKeyStartsWith('config.s')`);
    const locale = await localizations.deleteKeyStartsWith('config.s');
    console.log(locale);
  } catch (e) {
    console.error(e);
  }
  space();

  try {
    console.log(`localizations.deleteAll('config.test')`);
    const locale = await localizations.deleteAll({ key: 'config.test' });
    console.log(locale);
  } catch (e) {
    console.error(e);
  }
  space();

  try {
    console.log(`localizations.deleteAll({ locale: 'en' })`);
    const locale = await localizations.deleteAll({ locale: 'en' });
    console.log(locale);
  } catch (e) {
    console.error(e);
  }
  space();
};
