import _ from 'lodash';

type ObjectType = {
  [key: string]: any;
};

/**
 * Gets all keys from an object, including nested objects and arrays
 * @param object - The object to get keys from
 * @returns Array of keys in dot notation (e.g., 'user.address.street', 'items[0].name')
 */
function getObjectArrayKeys(object: ObjectType): string[] {
  const keys: string[] = [];
  _.forIn(object, (value, key) => {
    if (_.isPlainObject(value)) {
      _.forEach(getObjectArrayKeys(value as ObjectType), (k) => {
        keys.push(`${key}.${k}`);
      });
    } else if (_.isArray(value)) {
      _.forEach(value, (val, k) => {
        if (_.isPlainObject(val)) {
          _.forEach(getObjectArrayKeys(val as ObjectType), (_k) => {
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

export { getObjectArrayKeys };
