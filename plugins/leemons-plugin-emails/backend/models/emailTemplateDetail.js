module.exports = {
  modelName: 'email-template-detail',
  collectionName: 'email-template-detail',
  options: {
    useTimestamps: true,
  },
  attributes: {
    template: {
      references: {
        collection: 'plugins_emails::email-template',
      },
    },
    type: {
      type: 'string',
      options: {
        notNull: true,
      },
    },
    language: {
      type: 'string',
      options: {
        notNull: true,
      },
    },
    subject: {
      type: 'string',
      options: {
        notNull: true,
      },
    },
    html: {
      type: 'richtext',
      textType: 'mediumtext',
      options: {
        notNull: true,
      },
    },
  },
  primaryKey: {
    type: 'uuid',
  },
};

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
    template: {
      // referencia a 'emails_EmailTemplate',
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    language: {
      type: String,
      required: true,
    },
    subject: {
      type: String,
      required: true,
    },
    html: {
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

const emailTemplateModel = newModel(mongoose.connection, 'v1::emails_EmailTemplateDetail', schema);

module.exports = { emailTemplateModel };
