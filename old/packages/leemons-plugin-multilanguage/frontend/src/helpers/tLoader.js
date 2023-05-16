import _ from 'lodash';

function tLoader(prefix, translations) {
  return (key, replaces, returnFullKey, callback) => {
    const tKey = `${prefix}.${key}`;
    if (returnFullKey) return tKey;
    if (
      translations &&
      translations.items &&
      Object.prototype.hasOwnProperty.call(translations.items, tKey)
    ) {
      let item = _.get(translations.items, tKey);
      if (_.isObject(replaces)) {
        _.forIn(replaces, (value, _key) => {
          item = _.replace(item, `{${_key}}`, value);
        });
      }
      return item;
    }
    return callback || '';
  };
}

export default tLoader;
