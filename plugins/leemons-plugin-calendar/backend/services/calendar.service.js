/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

const _ = require('lodash');
const { LeemonsCacheMixin } = require('leemons-cache');
const { LeemonsMongoDBMixin } = require('leemons-mongodb');
const { LeemonsDeploymentManagerMixin } = require('leemons-deployment-manager');
const mongoose = require('mongoose');
const { LeemonsError } = require('leemons-error');
const { getServiceModels } = require('../models');
const calendar = require('../core/calendar');
const events = require('../core/events');
const eventTypes = require('../core/event-types');
const { validateKeyPrefix } = require('../validations/exists');
const restActions = require('./rest/calendar.rest');
const { LeemonsMiddlewaresMixin } = require('leemons-middlewares');
const { LeemonsMQTTMixin } = require('leemons-mqtt');

/** @type {ServiceSchema} */
module.exports = {
  name: 'calendar.calendar',
  version: 1,
  mixins: [
    LeemonsMiddlewaresMixin(),
    LeemonsCacheMixin(),
    LeemonsMongoDBMixin({
      models: getServiceModels(),
    }),
    LeemonsMQTTMixin(),
    LeemonsDeploymentManagerMixin(),
  ],
  actions: {
    ...restActions,
    add: {
      handler(ctx) {
        return calendar.add({ ...ctx.params, ctx });
      },
    },
    update: {
      handler(ctx) {
        return calendar.update({ ...ctx.params, ctx });
      },
    },
    remove: {
      handler(ctx) {
        return calendar.remove({ ...ctx.params, ctx });
      },
    },
    exist: {
      handler(ctx) {
        return calendar.exist({ ...ctx.params, ctx });
      },
    },
    existByKey: {
      handler(ctx) {
        return calendar.existByKey({ ...ctx.params, ctx });
      },
    },
    grantAccessUserAgentToCalendar: {
      handler(ctx) {
        return calendar.grantAccessUserAgentToCalendar({ ...ctx.params, ctx });
      },
    },
    unGrantAccessUserAgentToCalendar: {
      handler(ctx) {
        return calendar.unGrantAccessUserAgentToCalendar({ ...ctx.params, ctx });
      },
    },
    getCalendars: {
      handler(ctx) {
        return calendar.getCalendarsToFrontend({ ...ctx.params, ctx });
      },
    },
    addEvent: {
      handler(ctx) {
        const keys = _.isArray(ctx.params.key) ? ctx.params.key : [ctx.params.key];
        // Check if keys start with 'assignables'
        _.forEach(keys, (k) => {
          if (
            !ctx.callerPlugin.startsWith('assignables') &&
            !ctx.callerPlugin.startsWith('bulk-template')
          ) {
            validateKeyPrefix({ key: k, calledFrom: ctx.callerPlugin, ctx });
          }
        });
        return events.add({ ...ctx.params, ctx });
      },
    },
    addEventFromUser: {
      handler(ctx) {
        return events.addFromUser({ ...ctx.params, ctx });
      },
    },
    removeEvent: {
      handler(ctx) {
        if (!ctx.callerPlugin.startsWith('assignables')) {
          throw new LeemonsError(ctx, { message: 'You can not have access' });
        }
        return events.remove({ ...ctx.params, ctx });
      },
    },
    updateEvent: {
      handler(ctx) {
        if (!ctx.callerPlugin.startsWith('assignables')) {
          throw new LeemonsError(ctx, { message: 'You can not have access' });
        }
        return events.update({ ...ctx.params, ctx });
      },
    },
    getCalendarsByClass: {
      handler(ctx) {
        return ctx.tx.db.ClassCalendar.find({
          class: _.isArray(ctx.params.classe) ? ctx.params.classe : [ctx.params.classe],
        });
      },
    },
    grantAccessUserAgentToEvent: {
      handler(ctx) {
        if (!ctx.callerPlugin.startsWith('assignables')) {
          throw new LeemonsError(ctx, { message: 'You can not have access' });
        }
        return events.grantAccessUserAgentToEvent({ ...ctx.params, ctx });
      },
    },
    unGrantAccessUserAgentToEvent: {
      handler(ctx) {
        if (!ctx.callerPlugin.startsWith('assignables')) {
          throw new LeemonsError(ctx, { message: 'You can not have access' });
        }
        return events.unGrantAccessUserAgentToEvent({ ...ctx.params, ctx });
      },
    },
    addEventType: {
      handler(ctx) {
        return eventTypes.add({ ...ctx.params, ctx });
      },
    },
    listEventType: {
      handler(ctx) {
        return eventTypes.list({ ...ctx.params, ctx });
      },
    },
    existEventType: {
      handler(ctx) {
        return eventTypes.exist({ ...ctx.params, ctx });
      },
    },
    updateEventType: {
      handler(ctx) {
        return eventTypes.update({ ...ctx.params, ctx });
      },
    },
    removeEventType: {
      handler(ctx) {
        return eventTypes.remove({ ...ctx.params, ctx });
      },
    },
  },
  async created() {
    mongoose.connect(process.env.MONGO_URI);
  },
};
