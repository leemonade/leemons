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
    name: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    uri: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const rolesModel = newModel(mongoose.connection, 'v1::users_Roles', schema);

module.exports = { rolesModel };
