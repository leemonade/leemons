const mongoose = require('mongoose');

const { mixin } = require('./mixin');

module.exports = {
  LeemonsMongoDBMixin: mixin,
  mongoose,
  /**
   *
   * @param {import('mongoose').Connection} connection
   * @param {string} modelName
   * @param {import('mongoose').Schema} schema
   * @returns {import('mongoose').Model}
   */
  newModel(connection, modelName, schema) {
    schema.add({
      isDeleted: {
        type: Boolean,
        required: true,
        default: false,
      },
      deletedAt: {
        type: Date,
        default: null,
      },
    });
    if (connection.models.hasOwnProperty(modelName)) {
      return connection.models[modelName];
    }
    return connection.model(modelName, schema);
  },

  leemonsSchemaFields: {
    id: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    deploymentID: {
      type: String,
      required: true,
      index: true,
    },
  },
};
