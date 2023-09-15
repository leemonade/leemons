/* eslint-disable no-console */
/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

const { LeemonsValidator } = require('@leemons/validator');

const {
  LeemonsMiddlewareAuthenticated,
  LeemonsMiddlewareNecessaryPermits,
} = require('@leemons/middlewares');
const { getCalendarsToFrontend, getScheduleToFrontend } = require('../../core/calendar');
const eventTypesService = require('../../core/event-types');
const kanbanColumnsService = require('../../core/kanban-columns');
const listKanbanEventOrders = require('../../core/kanban-event-orders');
const calendarConfigsService = require('../../core/calendar-configs');
const {
  addFromUser,
  updateFromUser,
  updateEventSubTasksFromUser,
  removeFromUser,
} = require('../../core/events');

/** @type {ServiceSchema} */
module.exports = {
  getCalendarRest: {
    rest: {
      method: 'POST',
      path: '/',
    },
    middlewares: [
      LeemonsMiddlewareAuthenticated(),
      LeemonsMiddlewareNecessaryPermits({
        allowedPermissions: {
          'calendar.calendar': {
            actions: ['view', 'admin'],
          },
        },
      }),
    ],
    async handler(ctx) {
      const data = await getCalendarsToFrontend({ ...ctx.params, ctx });
      return { status: 200, ...data };
    },
  },
  getScheduleRest: {
    rest: {
      method: 'POST',
      path: '/schedule',
    },
    middlewares: [
      LeemonsMiddlewareAuthenticated(),
      LeemonsMiddlewareNecessaryPermits({
        allowedPermissions: {
          'calendar.calendar': {
            actions: ['view', 'admin'],
          },
        },
      }),
    ],
    async handler(ctx) {
      const data = await getScheduleToFrontend({ ...ctx.params, ctx });
      return { status: 200, ...data };
    },
  },
  getEventTypesRest: {
    rest: {
      method: 'GET',
      path: '/event-types',
    },
    middlewares: [LeemonsMiddlewareAuthenticated()],
    async handler(ctx) {
      const eventTypes = await eventTypesService.list({ ...ctx.params, ctx });
      return { status: 200, eventTypes };
    },
  },
  addEventRest: {
    rest: {
      method: 'POST',
      path: '/add/event',
    },
    middlewares: [LeemonsMiddlewareAuthenticated()],
    async handler(ctx) {
      const event = await addFromUser({ data: ctx.params.event, ctx });
      return { status: 200, event };
    },
  },
  updateEventRest: {
    rest: {
      method: 'POST',
      path: '/update/event',
    },
    middlewares: [LeemonsMiddlewareAuthenticated()],
    async handler(ctx) {
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
      } = ctx.params.event;
      const event = await updateFromUser({ id: ctx.params.id, data: body, ctx });
      return { status: 200, event };
    },
  },
  updateEventSubTasksRest: {
    rest: {
      method: 'POST',
      path: '/update/event-subtask',
    },
    middlewares: [LeemonsMiddlewareAuthenticated()],
    async handler(ctx) {
      const event = await updateEventSubTasksFromUser({ ...ctx.params, ctx });
      return { status: 200, event };
    },
  },
  removeEventRest: {
    rest: {
      method: 'POST',
      path: '/remove/event',
    },
    middlewares: [LeemonsMiddlewareAuthenticated()],
    async handler(ctx) {
      const event = await removeFromUser({ id: ctx.params.event, ctx });
      return { status: 200, event };
    },
  },
  listKanbanColumnsRest: {
    rest: {
      method: 'GET',
      path: '/kanban/list/columns',
    },
    middlewares: [LeemonsMiddlewareAuthenticated()],
    async handler(ctx) {
      const columns = await kanbanColumnsService.list({ ...ctx.params, ctx });
      return { status: 200, columns };
    },
  },
  listKanbanEventOrdersRest: {
    rest: {
      method: 'GET',
      path: '/kanban/list/event/orders',
    },
    middlewares: [LeemonsMiddlewareAuthenticated()],
    async handler(ctx) {
      const orders = await listKanbanEventOrders.list({ ...ctx.params, ctx });
      return { status: 200, orders };
    },
  },
  saveKanbanEventOrdersRest: {
    rest: {
      method: 'POST',
      path: '/kanban/save/event/orders',
    },
    middlewares: [LeemonsMiddlewareAuthenticated()],
    async handler(ctx) {
      const order = await listKanbanEventOrders.save({ ...ctx.params, ctx });
      return { status: 200, order };
    },
  },
  addCalendarConfigRest: {
    rest: {
      method: 'POST',
      path: '/configs/add',
    },
    middlewares: [
      LeemonsMiddlewareAuthenticated(),
      LeemonsMiddlewareNecessaryPermits({
        allowedPermissions: {
          'calendar.calendar-configs': {
            actions: ['create', 'update', 'admin'],
          },
        },
      }),
    ],
    async handler(ctx) {
      const config = await calendarConfigsService.add({ ...ctx.params.config, ctx });
      return { status: 200, config };
    },
  },
  updateCalendarConfigRest: {
    rest: {
      method: 'POST',
      path: '/configs/update/:id',
    },
    middlewares: [
      LeemonsMiddlewareAuthenticated(),
      LeemonsMiddlewareNecessaryPermits({
        allowedPermissions: {
          'calendar.calendar-configs': {
            actions: ['update', 'admin'],
          },
        },
      }),
    ],
    async handler(ctx) {
      const config = await calendarConfigsService.update({
        id: ctx.params.id,
        ...ctx.params.config,
        ctx,
      });
      return { status: 200, config };
    },
  },
  listCalendarConfigRest: {
    rest: {
      method: 'GET',
      path: '/configs/list',
    },
    middlewares: [
      LeemonsMiddlewareAuthenticated(),
      LeemonsMiddlewareNecessaryPermits({
        allowedPermissions: {
          'calendar.calendar-configs': {
            actions: ['view', 'admin'],
          },
        },
      }),
    ],
    async handler(ctx) {
      const configs = await calendarConfigsService.list({
        ctx,
      });
      return { status: 200, configs };
    },
  },
  detailCalendarConfigRest: {
    rest: {
      method: 'GET',
      path: '/configs/detail/:id',
    },
    middlewares: [
      LeemonsMiddlewareAuthenticated(),
      LeemonsMiddlewareNecessaryPermits({
        allowedPermissions: {
          'calendar.calendar-configs': {
            actions: ['view', 'admin'],
          },
        },
      }),
    ],
    async handler(ctx) {
      const config = await calendarConfigsService.detail({
        ...ctx.params,
        ctx,
      });
      return { status: 200, config };
    },
  },
  removeCalendarConfigRest: {
    rest: {
      method: 'DELETE',
      path: '/configs/remove/:id',
    },
    middlewares: [
      LeemonsMiddlewareAuthenticated(),
      LeemonsMiddlewareNecessaryPermits({
        allowedPermissions: {
          'calendar.calendar-configs': {
            actions: ['delete', 'admin'],
          },
        },
      }),
    ],
    async handler(ctx) {
      const config = await calendarConfigsService.remove({
        ...ctx.params,
        ctx,
      });
      return { status: 200, config };
    },
  },
  getCentersWithOutAssignRest: {
    rest: {
      method: 'GET',
      path: '/configs/centers-with-out-assign',
    },
    middlewares: [
      LeemonsMiddlewareAuthenticated(),
      LeemonsMiddlewareNecessaryPermits({
        allowedPermissions: {
          'calendar.calendar-configs': {
            actions: ['view', 'admin'],
          },
        },
      }),
    ],
    async handler(ctx) {
      const centers = await calendarConfigsService.getCentersWithOutAssign({
        ctx,
      });
      return { status: 200, centers };
    },
  },
  getCalendarConfigCalendarsRest: {
    rest: {
      method: 'GET',
      path: '/configs/calendars/:id',
    },
    middlewares: [
      LeemonsMiddlewareAuthenticated(),
      LeemonsMiddlewareNecessaryPermits({
        allowedPermissions: {
          'calendar.calendar-configs': {
            actions: ['view', 'admin'],
          },
        },
      }),
    ],
    async handler(ctx) {
      const calendars = await calendarConfigsService.getCalendars({
        ...ctx.params,
        withEvents: true,
        ctx,
      });
      return { status: 200, calendars };
    },
  },
  addConfigEventRest: {
    rest: {
      method: 'POST',
      path: '/configs/event/add',
    },
    middlewares: [
      LeemonsMiddlewareAuthenticated(),
      LeemonsMiddlewareNecessaryPermits({
        allowedPermissions: {
          'calendar.calendar-configs': {
            actions: ['create', 'update', 'admin'],
          },
        },
      }),
    ],
    async handler(ctx) {
      const event = await calendarConfigsService.addEvent({
        ...ctx.params,
        ctx,
      });
      return { status: 200, event };
    },
  },
  updateConfigEventRest: {
    rest: {
      method: 'POST',
      path: '/configs/event/update',
    },
    middlewares: [
      LeemonsMiddlewareAuthenticated(),
      LeemonsMiddlewareNecessaryPermits({
        allowedPermissions: {
          'calendar.calendar-configs': {
            actions: ['update', 'admin'],
          },
        },
      }),
    ],
    async handler(ctx) {
      const event = await calendarConfigsService.updateEvent({
        ...ctx.params,
        ctx,
      });
      return { status: 200, event };
    },
  },
  removeConfigEventRest: {
    rest: {
      method: 'POST',
      path: '/configs/event/remove',
    },
    middlewares: [
      LeemonsMiddlewareAuthenticated(),
      LeemonsMiddlewareNecessaryPermits({
        allowedPermissions: {
          'calendar.calendar-configs': {
            actions: ['delete', 'admin'],
          },
        },
      }),
    ],
    async handler(ctx) {
      const event = await calendarConfigsService.removeEvent({
        ...ctx.params,
        ctx,
      });
      return { status: 200, event };
    },
  },
};
