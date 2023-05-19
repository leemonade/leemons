"use strict";

const mixin = require("./mixin");
const mongoose = require("mongoose");

module.exports = {
  LeemonsMongoDBMixin: mixin,
  mongoose,
  newModel(connection, modelName, schema) {
    if (connection.models.hasOwnProperty(modelName)) {
      return connection.models[modelName];
    }
    return connection.model(modelName, schema);
  },
};
