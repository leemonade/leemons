const { mongoose, newModel } = require('@leemons/mongodb');

const schema = new mongoose.Schema(
  {
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
    //
    // and | or
    operator: {
      type: String,
      required: true,
    },
    rule: {
      // ref: 'plugins_grades::rules',
      type: String,
    },
  },
  {
    timestamps: true,
    minimize: false,
  }
);

const conditionGroupsModel = newModel(mongoose.connection, 'v1::grades_conditionGroups', schema);

module.exports = { conditionGroupsModel };
