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
    //
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    country: {
      type: String,
      required: true,
    },
    locale: {
      type: String,
      required: true,
    },
    center: {
      // ref: 'plugins_users::centers',
      type: String,
    },
    program: {
      type: String,
      //  ref: 'plugins_academic-portfolio::programs',
    },
    step: {
      type: Number,
    },
    published: {
      type: Boolean,
    },
    status: {
      type: String,
      enum: ['draft', 'published', 'archived'],
      default: 'draft',
    },
  },
  {
    timestamps: true,
    minimize: false,
  }
);

schema.index({ id: 1, deploymentID: 1, isDeleted: 1 });

const curriculumsModel = newModel(mongoose.connection, 'v1::curriculum_Curriculums', schema);

module.exports = { curriculumsModel };
