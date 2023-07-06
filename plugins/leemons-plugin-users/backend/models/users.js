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
    // masculino, femenino
    gender: {
      type: String,
      required: true,
      enum: ['male', 'female'],
    },
  },
  {
    timestamps: true,
  }
);

schema.index({ deploymentID: 1, email: 1 }, { unique: true });

const usersModel = newModel(mongoose.connection, 'users_User', schema);

module.exports = { usersModel };
