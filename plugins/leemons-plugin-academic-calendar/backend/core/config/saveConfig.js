/* eslint-disable no-param-reassign */
const _ = require('lodash');
const { validateSaveConfig } = require('../../validations/forms');
const { getConfig } = require('./getConfig');

async function saveConfig({ data, ctx }) {
  delete data.deleted_at;
  delete data.updated_at;
  delete data.created_at;
  delete data.deletedAt;
  delete data.updatedAt;
  delete data.createdAt;
  delete data.courseDays;
  delete data.courseHours;
  delete data.programStartDate;
  delete data.programEndDate;
  delete data.programEvents;
  delete data.allCoursesHaveSameHours;
  delete data.allDaysHaveSameHours;
  delete data.deleted;
  delete data.isDeleted;
  delete data._id;
  delete data.__v;
  delete data.id;
  validateSaveConfig(data);
  await ctx.tx.db.Config.findOneAndUpdate(
    { program: data.program },
    {
      ...data,
      substagesDates: JSON.stringify(data.substagesDates),
      courseEvents: JSON.stringify(data.courseEvents),
      courseDates: JSON.stringify(data.courseDates),
      breaks: JSON.stringify(data.breaks),
    },
    { new: true, upsert: true, lean: true }
  );
  return getConfig({ program: data.program, ctx });
}

module.exports = { saveConfig };
