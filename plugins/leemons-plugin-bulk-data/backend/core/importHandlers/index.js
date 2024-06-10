const { getLoadStatus } = require('./importBulkData');
const { loadFromFile } = require('./loadFromFile');
const { loadFromTemplateURL } = require('./loadTemplateFromUrl');

module.exports = { loadFromFile, getLoadStatus, loadFromTemplateURL };
