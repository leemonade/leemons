const { mongoose, newModel } = require('leemons-mongodb');

const schema = new mongoose.Schema({
  deploymentID: {
    type: String,
    required: true,
    index: true,
  },
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
});

const centerLimitsModel = newModel(mongoose.connection, 'users_CenterLimits', schema);

module.exports = { centerLimitsModel };
