const _ = require('lodash');
const { getActionNameFromCTX } = require('leemons-service-name-parser');

module.exports = () => ({
  name: '',
  hooks: {
    before: {
      '*': [
        async function (ctx) {
          const action = this.schema.actions[getActionNameFromCTX(ctx)];
          // eslint-disable-next-line no-prototype-builtins
          if (_.isObject(action) && action.hasOwnProperty('middlewares')) {
            const middlewares = _.isArray(action.middlewares)
              ? action.middlewares
              : [action.middlewares];
            for (let i = 0, l = middlewares.length; i < l; i++) {
              // eslint-disable-next-line no-await-in-loop
              await middlewares[i](ctx);
            }
          }
        },
      ],
    },
  },
});
