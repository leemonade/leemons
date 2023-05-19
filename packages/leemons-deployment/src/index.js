"use strict";

const mixin = require("./mixin");
const { getDeploymentIDFromCTX } = require("./getDeploymentIDFromCTX");

module.exports = {
  LeemonsDeploymentIDMixin: mixin,
  getDeploymentIDFromCTX,
};
