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
    //
    template: {
      // ref: 'plugins_emails::email-template'
      type: String,
    },
    type: {
      type: String,
      require: true,
    },
    language: {
      type: String,
      require: true,
    },
    subject: {
      type: String,
      require: true,
    },
    html: {
      type: String,
      require: true,
    },
  },
  {
    timestamps: true,
    minimize: false,
  }
);

const emailTemplateDetailModel = newModel(
  mongoose.connection,
  'v1::emails_EmailTemplateDetail',
  schema
);

module.exports = { emailTemplateDetailModel };
