const mongoose = require('mongoose');
const { mixin } = require('./mixin');

module.exports = {
  LeemonsMongoDBMixin: mixin,
  mongoose,
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
};
