const upload = require('./upload');
const uploadFromUrl = require('./uploadFromUrl');
const uploadFromFileStream = require('./uploadFromFileStream');
const prepareImage = require('./prepareImage');

module.exports = { ...upload, ...uploadFromUrl, ...uploadFromFileStream, ...prepareImage };
