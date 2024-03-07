const { mongoose, newModel } = require('@leemons/mongodb');

const schema = new mongoose.Schema(
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
    //
    name: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    listType: {
      type: String,
      required: true,
    },
    levelOrder: {
      type: Number,
      required: true,
    },
    curriculum: {
      // ref:'plugins_curriculum::curriculums',
      type: String,
    },
  },
  {
    timestamps: true,
    minimize: false,
  }
);

schema.index({ curriculum: 1, deploymentID: 1, isDeleted: 1 });
schema.index({ id: 1, deploymentID: 1, isDeleted: 1 });

const nodeLevelsModel = newModel(mongoose.connection, 'v1::curriculum_nodeLevels', schema);

module.exports = { nodeLevelsModel };
