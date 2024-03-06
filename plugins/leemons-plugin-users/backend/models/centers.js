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
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    locale: {
      type: String,
      required: true,
    },
    email: {
      type: String,
    },
    uri: {
      type: String,
      required: true,
    },
    timezone: {
      type: String,
    },
    firstDayOfWeek: {
      type: Number,
    },
    country: {
      type: String,
    },
    city: {
      type: String,
    },
    postalCode: {
      type: String,
    },
    street: {
      type: String,
    },
    phone: {
      type: String,
    },
    contactEmail: {
      type: String,
    },
  },
  {
    timestamps: true,
    minimize: false,
  }
);

schema.index({ deploymentID: 1, name: 1 }, { unique: true });
schema.index({ deploymentID: 1, uri: 1 }, { unique: true });

schema.index({ id: 1, deploymentID: 1, isDeleted: 1 });
schema.index({ name: 1, deploymentID: 1, isDeleted: 1 });

const centersModel = newModel(mongoose.connection, 'v1::users_Centers', schema);

module.exports = { centersModel };
