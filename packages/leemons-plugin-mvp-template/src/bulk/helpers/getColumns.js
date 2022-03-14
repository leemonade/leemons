const { range } = require('lodash');

function getColumns(len = 10) {
  return range(1, len).map((i) => ({
    // Column index (1,2,3....n); `1` for column `A`
    index: i,

    // Indicade where in imported object data should be placed
    key: i,
  }));
}

module.exports = getColumns;
