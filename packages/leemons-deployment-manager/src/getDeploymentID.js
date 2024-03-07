const { LeemonsError } = require('@leemons/error');
const { getDeploymentIDFromCTX } = require('./getDeploymentIDFromCTX');

async function getDeploymentID(ctx) {
  try {
    ctx.meta.deploymentID = getDeploymentIDFromCTX(ctx);
  } catch (e) {
    const { params } = ctx;

    if (params?.req?.query?.deploymentID) {
      ctx.meta.deploymentID = params.req.query.deploymentID;
      delete params.req.query.deploymentID;
    } else {
      // Si llega un error es que no se encontrado ningun deploymentID, comprobamos la ultima opcion (el dominio)
      ctx.meta.deploymentID = await ctx.__leemonsDeploymentManagerCall(
        'deployment-manager.getDeploymentIDByDomain'
      );
    }

    if (!ctx.meta.deploymentID) {
      throw new LeemonsError(ctx, { message: `No deploymentID found [${ctx.meta.hostname}]` });
    }
  }
}

module.exports = {
  getDeploymentID,
};
