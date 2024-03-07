import _ from 'lodash';

function tKeys(key, objKeys, replaces) {
  const tKey = key;
  if (objKeys && Object.prototype.hasOwnProperty.call(objKeys, tKey)) {
    let item = _.get(objKeys, tKey);
    if (_.isObject(replaces)) {
      _.forIn(replaces, (value, _key) => {
        item = _.replace(item, `{${_key}}`, value);
      });
    }
    return item;
  }
  return tKey;
}

export default tKeys;
