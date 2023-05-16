const { format } = require('winston');

module.exports = format(({ splat, ...rest }) => rest);
