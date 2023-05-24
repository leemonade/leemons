const _ = require('lodash');
const { getDeploymentIDFromCTX } = require('./getDeploymentIDFromCTX');

function onAction(next, action) {
  console.log(action.name);
  if (action) {
    return function (ctx) {
      ctx.meta.deploymentID = getDeploymentIDFromCTX(ctx);
      ctx.__leemonsDeploymentManagerCall = ctx.call;
      // ctx.call = () => {};
      return next(ctx);
    };
  }
  return next;
}

module.exports = {
  name: 'DeploymentManagerMiddleware',
  remoteAction: onAction,
  localAction: onAction,
};
