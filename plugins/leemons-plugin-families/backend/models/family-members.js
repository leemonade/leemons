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
    user: {
      type: String,
      // ref: 'plugins_users::users',
    },
    family: {
      type: String,
      // ref: 'plugins_families::families',
    },
    memberType: {
      type: String,
    },
  },
  {
    timestamps: true,
    minimize: false,
  }
);

const familyMembersModel = newModel(mongoose.connection, 'v1::families_FamilyMembers', schema);

module.exports = { familyMembersModel };
