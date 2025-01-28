const { leemonsSchemaFields, mongoose, newModel } = require('@leemons/mongodb');

const { PLUGIN_NAME, VERSION } = require('../config/constants');

const schema = new mongoose.Schema({
  ...leemonsSchemaFields,
  classId: {
    type: String,
    required: true,
  },
  period: {
    type: String,
    required: true,
  },
  index: {
    type: Number,
    required: true,
  },
});

const retakesModel = newModel(mongoose.connection, `v${VERSION}::${PLUGIN_NAME}_Retakes`, schema);

module.exports = {
  retakesModel,
};
