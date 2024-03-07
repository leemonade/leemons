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
    surnames: {
      type: String,
    },
    secondSurname: {
      type: String,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
    },
    avatar: {
      type: String,
    },
    avatarAsset: {
      type: String,
    },
    birthdate: {
      type: Date,
      required: true,
    },
    password: {
      type: String,
    },
    locale: {
      type: String,
      required: true,
    },
    active: {
      type: Boolean,
      required: true,
      default: false,
    },
    status: {
      type: String,
    },
    // 'male', 'female', 'other'
    gender: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    minimize: false,
  }
);

schema.index({ deploymentID: 1, email: 1 }, { unique: true });

schema.index({ id: 1, deploymentID: 1, isDeleted: 1 });
schema.index({ name: 1, deploymentID: 1, isDeleted: 1 });
schema.index({ surname: 1, deploymentID: 1, isDeleted: 1 });
schema.index({ secondSurname: 1, deploymentID: 1, isDeleted: 1 });

const usersModel = newModel(mongoose.connection, 'v1::users_User', schema);

module.exports = { usersModel };
