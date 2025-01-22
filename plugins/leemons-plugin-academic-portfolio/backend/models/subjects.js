const { mongoose, newModel } = require('@leemons/mongodb');

// Define customPeriod sub-schema
const customPeriodSchema = new mongoose.Schema(
  {
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    description: {
      type: String,
    },
  },
  { _id: false }
);

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
    program: {
      type: String,
      // ref: 'plugins_academic-portfolio::programs',
    },
    course: {
      type: String,
      // ref: 'plugins_academic-portfolio::groups',
    },
    image: {
      type: String,
    },
    icon: {
      type: String,
    },
    color: {
      type: String,
    },
    useBlocks: {
      type: Boolean,
      default: false,
    },
    customPeriod: {
      type: customPeriodSchema,
      default: null,
    },
  },
  {
    timestamps: true,
    minimize: false,
  }
);

schema.index({ program: 1, deploymentID: 1, isDeleted: 1 });
schema.index({ id: 1, program: 1, deploymentID: 1, isDeleted: 1 });

const subjectsModel = newModel(mongoose.connection, 'v1::academic-portfolio_Subjects', schema);

module.exports = { subjectsModel, customPeriodSchema };
