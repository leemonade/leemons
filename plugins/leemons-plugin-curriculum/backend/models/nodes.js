const { mongoose, newModel } = require('leemons-mongodb');

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
    name: {
      type: String,
      required: true,
    },
    fullName: {
      type: String,
    },
    nameOrder: {
      type: String,
    },
    academicItem: {
      type: String,
    },
    // ES: Orden dentro del mismo padre
    // EN: Order inside the same parent
    nodeOrder: {
      type: Number,
      required: true,
    },
    parentNode: {
      // ref: 'plugins_curriculum::nodes',
      type: String,
    },
    nodeLevel: {
      type: String,
      // ref: 'plugins_curriculum::node-levels',
    },
    curriculum: {
      // ref: 'plugins_curriculum::curriculums',
      type: String,
    },
    treeId: {
      type: String,
    },
    data: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const nodesModel = newModel(mongoose.connection, 'v1::curriculum_Nodes', schema);

module.exports = { nodesModel };
