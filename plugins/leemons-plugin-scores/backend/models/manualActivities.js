const { leemonsSchemaFields, mongoose, newModel } = require('@leemons/mongodb');

const { PLUGIN_NAME, VERSION } = require('../config/constants');

const schema = new mongoose.Schema({
  ...leemonsSchemaFields,
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  date: {
    type: Date,
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
  classId: {
    type: String,
    required: true,
  },
});

const manualActivitiesModel = newModel(
  mongoose.connection,
  `v${VERSION}::${PLUGIN_NAME}_ManualActivities`,
  schema
);

module.exports = {
  manualActivitiesModel,
};
