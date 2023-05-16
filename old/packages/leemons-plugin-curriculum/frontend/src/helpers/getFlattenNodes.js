import _ from 'lodash';

// eslint-disable-next-line import/prefer-default-export
export function getFlattenNodes(items) {
  const result = [];

  function flatten(childrens) {
    _.forEach(childrens, (child) => {
      result.push(child);
      if (_.isArray(child.childrens)) {
        flatten(child.childrens);
      }
    });
  }

  flatten(items);
  return result;
}
