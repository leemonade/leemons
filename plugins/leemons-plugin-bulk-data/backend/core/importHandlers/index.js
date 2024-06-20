const { getLoadStatus } = require('./getLoadStatus');
const { getStatusWhenLocal } = require('./importBulkData');
const { loadFromFile } = require('./loadFromFile');
const { loadFromTemplateURL } = require('./loadTemplateFromUrl');

module.exports = { loadFromFile, getLoadStatus, getStatusWhenLocal, loadFromTemplateURL };
