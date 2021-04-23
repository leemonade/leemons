const logger = require('./lib');

logger.level = 'silly';
logger.error(`This is an error log %o`, { name: 'Miguel' }, { name: 'pepe' });
logger.warn(`This is a warn log`);
logger.info(`This is an info log`);
logger.http(`This is a http log`);
logger.verbose(`This is a verbose log`);
logger.debug(`This is a debug log`);
logger.silly(`This is a silly log`);
