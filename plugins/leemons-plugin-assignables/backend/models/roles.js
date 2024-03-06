const { mongoose, newModel } = require('@leemons/mongodb');

const rolesSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    deploymentID: {
      type: String,
      required: true,
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
    minimize: false,
  }
);

rolesSchema.index({ deploymentID: 1, name: 1 }, { unique: true });
rolesSchema.index({ name: 1, deploymentID: 1, isDeleted: 1 });

const rolesModel = newModel(mongoose.connection, 'v1::assignables_Roles', rolesSchema);

module.exports = { rolesModel, rolesSchema };
