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
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    addedFrom: {
      type: String,
      required: true,
    },
    countryName: {
      type: String,
      required: true,
    },
    countryShortCode: {
      type: String,
      required: true,
    },
    regionShortCode: {
      type: String,
      required: true,
    },
    regionName: {
      type: String,
      required: true,
    },
    startMonth: {
      type: Number,
      required: true,
    },
    startYear: {
      type: Number,
      required: true,
    },
    endMonth: {
      type: Number,
      required: true,
    },
    endYear: {
      type: Number,
      required: true,
    },
    weekday: {
      type: Number,
      required: true,
    },
    notSchoolDays: {
      type: String,
      required: true,
    },
    schoolDays: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const calendarConfigsModel = newModel(mongoose.connection, 'v1::calendar_calendarConfigs', schema);

module.exports = { calendarConfigsModel };
