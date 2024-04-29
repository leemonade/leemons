const {
  LeemonsMiddlewareAuthenticated,
  LeemonsMiddlewareNecessaryPermits,
} = require('@leemons/middlewares');

const getWeights = require('../../core/weights/getWeights');
const { setWeight } = require('../../core/weights');
const { permissionNames } = require('../../config/constants');

const getRest = require('./openapi/weights/getRest');
const setRest = require('./openapi/weights/setRest');
/** @type {ServiceSchema} */
module.exports = {
  getRest: {
    openapi: getRest.openapi,
    rest: {
      method: 'GET',
      path: '/',
    },
    middlewares: [
      LeemonsMiddlewareAuthenticated(),
      LeemonsMiddlewareNecessaryPermits({
        allowedPermissions: {
          [permissionNames.weights]: {
            actions: ['view', 'admin'],
          },
        },
      }),
    ],
    async handler(ctx) {
      const { classes } = ctx.params;

      const weights = await getWeights({ classes, ctx });

      return { status: 200, weights };
    },
  },
  setRest: {
    openapi: setRest.openapi,
    rest: {
      method: 'PUT',
      path: '/',
    },
    middlewares: [
      LeemonsMiddlewareAuthenticated(),
      LeemonsMiddlewareNecessaryPermits({
        allowedPermissions: {
          [permissionNames.weights]: {
            actions: ['update', 'admin'],
          },
        },
      }),
    ],
    async handler(ctx) {
      const { weight: weightData, class: classId } = ctx.params;

      const weight = await setWeight({
        weight: { ...weightData, class: classId },
        ctx,
      });

      return { status: 201, weight };
    },
  },
};
