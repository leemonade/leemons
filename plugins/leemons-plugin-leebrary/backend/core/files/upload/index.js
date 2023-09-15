const upload = require('./upload');
const uploadFromUrl = require('./uploadFromUrl');

module.exports = { ...upload, ...uploadFromUrl };
