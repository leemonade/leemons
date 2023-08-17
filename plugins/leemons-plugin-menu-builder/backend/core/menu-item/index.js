/* eslint-disable global-require */

module.exports = {
  ...require('./add'),
  ...require('./exist'),
  ...require('./remove'),
  ...require('./update'),
  ...require('./enable'),
  ...require('./removeAll'),
  ...require('./getByMenuAndKey'),
  ...require('./addCustomForUser'),
  ...require('./addItemsFromPlugin'),
  ...require('./removeCustomForUser'),
  ...require('./updateCustomForUser'),
  ...require('./reOrderCustomUserItems'),
  ...require('./addCustomForUserWithProfile'),
};
