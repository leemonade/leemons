const { mongoose, newModel } = require('leemons-mongodb');

const usersSchema = new mongoose.Schema({
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
    unique: true,
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
});

const usersModel = newModel(mongoose.connection, 'users_User', usersSchema);

module.exports = { usersModel };
