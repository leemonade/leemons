const { omit } = require('lodash');

module.exports = async function updateModule({ id, module, published, ctx }) {
  return ctx.tx.call('assignables.assignables.updateAssignable', {
    assignable: {
      ...omit(module, ['published', 'role']),
      id,
    },
    published,
  });
};
