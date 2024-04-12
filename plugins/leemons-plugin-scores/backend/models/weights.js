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
    class: {
      type: String,
      index: true,
      required: true,
      unique: true,
    },
    type: {
      type: String,
      enum: ['averages', 'roles', 'modules'],
      required: true,
    },
    weights: [
      {
        id: {
          type: String,
          required: true,
        },
        weight: {
          type: Number,
          required: true,
          min: 0,
          max: 1,
        },
        isLocked: {
          type: Boolean,
          default: false,
        },
      },
    ],
    explanation: {
      type: String,
      nullable: true,
    },
    applySameValue: {
      type: Boolean,
    },
  },
  {
    timestamps: true,
  }
);

const weightsModel = newModel(mongoose.connection, 'v1::scores_Weights', schema);

module.exports = { weightsModel };
