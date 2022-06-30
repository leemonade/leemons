import * as _ from 'lodash';

export default function getObjectArrayKeys(object) {
  const keys = [];
  _.forIn(object, (value, key) => {
    if (_.isPlainObject(value)) {
      _.forEach(getObjectArrayKeys(value), (k) => {
        keys.push(`${key}.${k}`);
      });
    } else if (_.isArray(value)) {
      _.forEach(value, (val, k) => {
        if (_.isPlainObject(val)) {
          _.forEach(getObjectArrayKeys(val), (_k) => {
            keys.push(`${key}[${k}].${_k}`);
          });
        } else {
          keys.push(`${key}[${k}]`);
        }
      });
    } else {
      keys.push(key);
    }
  });
  return keys;
}
