const { mongoose, newModel } = require('leemons-mongodb');

const rolesSchema = new mongoose.Schema(
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
    name: {
      type: String,
      required: true,
    },
    teacherDetailUrl: {
      type: String,
    },
    studentDetailUrl: {
      type: String,
    },
    evaluationDetailUrl: {
      type: String,
    },
    dashboardUrl: {
      type: String,
    },
    previewUrl: {
      type: String,
    },
    plugin: {
      type: String,
    },
    icon: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

rolesSchema.index({ deploymentID: 1, name: 1 }, { unique: true });

const rolesModel = newModel(mongoose.connection, 'v1::assignables_Roles', rolesSchema);

module.exports = { rolesModel, rolesSchema };
