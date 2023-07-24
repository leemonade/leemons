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
    //  'users_Centers',
    center: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users_Centers',
      required: true,
    },
    type: {
      type: String,
      enum: ['group', 'profile'],
    },
    item: {
      type: String,
    },
    unlimited: {
      type: Boolean,
    },
    limit: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

const centerLimitsModel = newModel(mongoose.connection, 'v1::users_CenterLimits', schema);

module.exports = { centerLimitsModel };
