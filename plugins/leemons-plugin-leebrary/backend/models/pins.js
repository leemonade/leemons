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
    asset: {
      specificType: String,
    },
    userAgent: {
      // ref: 'plugins_users::user-agent',
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const pinsModel = newModel(mongoose.connection, 'v1::leebrary_Pins', schema);

module.exports = { pinsModel };
