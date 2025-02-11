/* eslint-disable no-console */
/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

const { LeemonsMiddlewareAuthenticated } = require('@leemons/middlewares');
const _ = require('lodash');

const { getInstance } = require('../../core/instances/getInstance');
const { getInstances } = require('../../core/instances/getInstances');
const { removeInstance } = require('../../core/instances/removeInstance/removeInstance');
const { searchInstances } = require('../../core/instances/searchInstances');
const { sendReminder } = require('../../core/instances/sendReminder');
const { updateInstance } = require('../../core/instances/updateInstance');

function parseBoolean(value, checkUndefined = true) {
  const trueValues = ['true', true, '1', 1];
  if (checkUndefined) {
    return _.isNil(value) ? undefined : trueValues.includes(value);
  }
  return trueValues.includes(value);
}

async function get(ctx) {
  const { id, details, ids, throwOnMissing, relatedInstances } = ctx.params;

  if (id) {
    const assignableInstance = await getInstance({
      id,
      details: details === 'true',
      ctx,
    });

    return {
      status: 200,
      assignableInstance,
    };
  }
  const instances = await getInstances({
    ids: Array.isArray(ids) ? ids : [ids],
    details: _.isBoolean(details) ? details : details === 'true',
    throwOnMissing: _.isBoolean(throwOnMissing) ? throwOnMissing : throwOnMissing === 'true',
    relatedAssignableInstances: _.isBoolean(relatedInstances)
      ? relatedInstances
      : relatedInstances === 'true',
    ctx,
  });

  return {
    status: 200,
    instances,
  };
}

/** @type {ServiceSchema} */
module.exports = {
  searchRest: {
    rest: {
      method: 'GET',
      path: '/search',
    },
    middlewares: [LeemonsMiddlewareAuthenticated()],
    async handler(ctx) {
      const query = ctx.params;

      query.closed = parseBoolean(query.closed);
      query.evaluated = parseBoolean(query.evaluated);
      query.archived = parseBoolean(query.archived);
      query.finished = parseBoolean(query.finished);
      query.visible = parseBoolean(query.visible);
      query.calificableOnly = parseBoolean(query.calificableOnly, false);
      query.isEvaluable = parseBoolean(query.isEvaluable, false);
      query.isTeacher = parseBoolean(query.isTeacher, false);
      query.useRangeHours = parseBoolean(query.useRangeHours);

      const assignableInstances = await searchInstances({ query, ctx });

      return {
        status: 200,
        assignableInstances,
      };
    },
  },
  getRest: {
    rest: {
      method: 'GET',
      path: '/find',
    },
    middlewares: [LeemonsMiddlewareAuthenticated()],
    async handler(ctx) {
      return get(ctx);
    },
  },
  updateRest: {
    rest: {
      method: 'PUT',
      path: '/:id',
    },
    middlewares: [LeemonsMiddlewareAuthenticated()],
    async handler(ctx) {
      const { id, dates } = ctx.params;

      const updatedAssignableInstance = await updateInstance({
        assignableInstance: {
          id,
          dates,
        },
        ctx,
      });

      return {
        status: 200,
        assignableInstance: updatedAssignableInstance,
      };
    },
  },
  sendReminderRest: {
    rest: {
      method: 'POST',
      path: '/reminder',
    },
    middlewares: [LeemonsMiddlewareAuthenticated()],
    async handler(ctx) {
      await sendReminder({
        ...ctx.params,
        ctx,
      });

      return {
        status: 200,
      };
    },
  },
  getRest2: {
    rest: {
      method: 'GET',
      path: '/:id',
    },
    middlewares: [LeemonsMiddlewareAuthenticated()],
    async handler(ctx) {
      return get(ctx);
    },
  },
  deleteRest: {
    rest: {
      method: 'DELETE',
      path: '/:id',
    },
    params: {
      id: 'string',
    },
    middlewares: [LeemonsMiddlewareAuthenticated()],
    async handler(ctx) {
      const removed = await removeInstance({ id: ctx.params.id, ctx });

      return {
        status: 200,
        removed,
      };
    },
  },
};
