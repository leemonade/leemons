/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

const { LeemonsCacheMixin } = require('@leemons/cache');
const { LeemonsDeploymentManagerMixin } = require('@leemons/deployment-manager');
const { LeemonsError } = require('@leemons/error');
const { LeemonsMiddlewaresMixin } = require('@leemons/middlewares');
const { LeemonsMongoDBMixin, mongoose } = require('@leemons/mongodb');
const { LeemonsMQTTMixin } = require('@leemons/mqtt');
const _ = require('lodash');

const calendar = require('../core/calendar');
const eventTypes = require('../core/event-types');
const events = require('../core/events');
const { getServiceModels } = require('../models');
const { validateKeyPrefix } = require('../validations/exists');

const restActions = require('./rest/calendar.rest');

const FORBIDDEN_MESSAGE = 'Access denied from this plugin';

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
    detailByKey: {
      handler(ctx) {
        return calendar.detailByKey({ ...ctx.params, ctx });
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
            !ctx.callerPlugin.startsWith('bulk-data')
          ) {
            validateKeyPrefix({ key: k, calledFrom: ctx.callerPlugin, ctx });
          }
        });
        return events.add({ ...ctx.params, ctx });
      },
    },
    addEventFromUser: {
      params: {
        event: { type: 'object' },
        ownerUserAgentId: { type: 'string', optional: true },
      },
      async handler(ctx) {
        const { ownerUserAgentId, event } = ctx.params;

        return events.addFromUser({ data: event, ownerUserAgentId, ctx });
      },
    },
    updateEventFromUser: {
      params: {
        id: { type: 'string' },
        event: { type: 'object' },
        ownerUserAgentId: { type: 'string', optional: true },
      },
      async handler(ctx) {
        const { id, ownerUserAgentId, event } = ctx.params;
        const {
          calendarName,
          userAgents,
          owners,
          image,
          disableDrag,
          isDeleted,
          createdAt,
          updatedAt,
          deploymentID,
          deletedAt,
          _id,
          __v,
          ...body
        } = event;

        return events.updateFromUser({ id, data: body, ownerUserAgentId, ctx });
      },
    },
    removeEventFromUser: {
      params: {
        id: { type: 'string' },
        ownerUserAgentId: { type: 'string', optional: true },
      },
      async handler(ctx) {
        const { id, ownerUserAgentId } = ctx.params;

        return events.removeFromUser({ id, ownerUserAgentId, ctx });
      },
    },
    removeEvent: {
      handler(ctx) {
        if (!ctx.callerPlugin.startsWith('assignables')) {
          throw new LeemonsError(ctx, { message: FORBIDDEN_MESSAGE });
        }
        return events.remove({ ...ctx.params, ctx });
      },
    },
    updateEvent: {
      handler(ctx) {
        if (!ctx.callerPlugin.startsWith('assignables')) {
          throw new LeemonsError(ctx, { message: FORBIDDEN_MESSAGE });
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
          throw new LeemonsError(ctx, { message: FORBIDDEN_MESSAGE });
        }
        return events.grantAccessUserAgentToEvent({ ...ctx.params, ctx });
      },
    },
    unGrantAccessUserAgentToEvent: {
      handler(ctx) {
        if (!ctx.callerPlugin.startsWith('assignables')) {
          throw new LeemonsError(ctx, { message: FORBIDDEN_MESSAGE });
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
    // mongoose.connect(process.env.MONGO_URI);
  },
};
