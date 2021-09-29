import _ from 'lodash';

function tLoader(prefix, translations) {
  return (key, replaces, returnFullKey) => {
    const tKey = `${prefix}.${key}`.toLowerCase();
    if (returnFullKey) return tKey;
    if (
      translations &&
      translations.items &&
      Object.prototype.hasOwnProperty.call(translations.items, tKey)
    ) {
      let item = _.get(translations.items, tKey.toLowerCase());
      if (_.isObject(replaces)) {
        _.forIn(replaces, (value, _key) => {
          item = _.replace(item, `{${_key}}`, value);
        });
      }
      return item;
    }
    return key;
  };
}

export default tLoader;
