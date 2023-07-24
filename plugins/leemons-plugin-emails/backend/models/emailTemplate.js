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
    name: {
      type: String,
      required: true,
    },
    templateName: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

schema.index({ deploymentID: 1, name: 1 }, { unique: true });
schema.index({ deploymentID: 1, templateName: 1 }, { unique: true });

const emailTemplateModel = newModel(mongoose.connection, 'v1::emails_EmailTemplate', schema);

module.exports = { emailTemplateModel };
