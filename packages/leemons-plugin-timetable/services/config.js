const create = require('../src/services/config/create');
const get = require('../src/services/config/get');
const has = require('../src/services/config/has');
const update = require('../src/services/config/update');
const deleteConfig = require('../src/services/config/delete');

module.exports = {
  create,
  get,
  has,
  update,
  delete: deleteConfig,
};
