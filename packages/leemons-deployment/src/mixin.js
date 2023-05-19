const _ = require("lodash");
const { getDeploymentIDFromCTX } = require("./getDeploymentIDFromCTX");

module.exports = {
  name: "",
  hooks: {
    before: {
      "*": [
        async function (ctx) {
          ctx.meta.deploymentID = getDeploymentIDFromCTX(ctx);
        },
      ],
    },
  },
};
