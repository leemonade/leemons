const _ = require('lodash');

function getValuesForReturn(items) {
  if (items) {
    const r = { r: undefined };
    _.forEach(items, (item) => {
      const toAdd = { value: JSON.parse(item.value), id: item.id };
      let path = '';
      if (item.metadata) {
        const metadata = JSON.parse(item.metadata);
        const { path: p, ...restMetadata } = metadata;
        if (p) path = p;
        if (_.isObject(restMetadata) && Object.keys(restMetadata).length)
          toAdd.metadata = restMetadata;
      }

      _.set(r, `r${path}`, toAdd);
    });
    return r.r;
  }
  return undefined;
}

module.exports = { getValuesForReturn };
