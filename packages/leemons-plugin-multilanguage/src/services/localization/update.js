const validateLocale = require('../../../validations/locale');
const validateDataType = require('../../../validations/datatypes');
const throwInvalid = require('../../../validations/throwInvalid');

const localesTable = leemons.query('plugins_multilanguage::locales');

async function setValue(key, locale, value) {
  try {
    return await localesTable.update({ key, locale }, { value });
  } catch (e) {
    if (e.message === 'entry.notFound') {
      return null;
    }

    leemons.log.debug(e.message);
    throw new Error('An error occurred while updating the localization');
  }
}

async function setKey(key, locale, value) {
  try {
    return await localesTable.update({ key, locale }, { value });
  } catch (e) {
    if (e.message === 'entry.notFound') {
      return null;
    }

    leemons.log.debug(e.message);
    throw new Error('An error occurred while updating the localization');
  }
}

module.exports = {
  setValue,
};
