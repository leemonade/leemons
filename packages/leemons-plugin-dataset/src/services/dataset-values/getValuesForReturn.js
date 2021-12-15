const _ = require('lodash');

function getValuesForReturn(items) {
  if (items) {
    const r = { r: undefined };
    _.forEach(items, (item) => {
      let path = '';
      if (item.metadata) {
        const metadata = JSON.parse(item.metadata);
        if (metadata.path) path = metadata.path;
      }
      // TODO Añadir que se devuelva el metadata si hay algo mas aparte del path
      _.set(r, `r${path}`, { value: JSON.parse(item.value), id: item.id });
    });
    return r.r;
  }
  return undefined;
}

module.exports = { getValuesForReturn };
