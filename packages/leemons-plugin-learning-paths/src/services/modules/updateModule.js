const { omit } = require('lodash');

module.exports = async function updateModule(
  id,
  module,
  { published, userSession, transacting } = {}
) {
  const assignablesServices = leemons.getPlugin('assignables').services.assignables;

  const updatedModule = await assignablesServices.updateAssignable(
    {
      ...omit(module, ['published', 'role']),
      id,
    },
    {
      published,
      userSession,
      transacting,
    }
  );

  return updatedModule;
};
