import _ from 'lodash';

function tLoader(prefix, translations) {
  return (key, replaces) => {
    const tKey = `${prefix}.${key}`.toLowerCase();
    if (
      translations &&
      translations.items &&
      Object.prototype.hasOwnProperty.call(translations.items, tKey)
    ) {
      let item = _.get(translations.items, tKey);
      if (_.isObject(replaces)) {
        _.forIn(replaces, (value, key) => {
          item = _.replace(item, `{${key}}`, value);
        });
      }
      return item;
    }
    return null;
  };
}

module.exports = tLoader;
