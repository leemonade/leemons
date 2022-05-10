const { exists } = require('../src/services/assets/exists');
const { add } = require('../src/services/assets/add');
const { getByIds } = require('../src/services/assets/getByIds');
const { update } = require('../src/services/assets/update');
const { remove } = require('../src/services/assets/remove');

module.exports = {
  getByIds,
  exists,
  update,
  add,
  remove,
  getCoverUrl: (assetId) => `/api/leebrary/img/${assetId}`,
};
