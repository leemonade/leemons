/** @type {import('moleculer').ServiceSchema} */

const { LeemonsCacheMixin } = require('@leemons/cache');
const { LeemonsCronJobsMixin } = require('@leemons/cronjobs');
const { LeemonsDeploymentManagerMixin } = require('@leemons/deployment-manager');
const { LeemonsMiddlewaresMixin } = require('@leemons/middlewares');
const { LeemonsMongoDBMixin } = require('@leemons/mongodb');
const { LeemonsMQTTMixin } = require('@leemons/mqtt');

const {
  addStudentsToOpenInstancesWithClass,
} = require('../core/assignations/addStudentToOpenInstancesWithClass');
const { adminDashboard } = require('../core/instances/adminDashboard');
const { createInstance } = require('../core/instances/createInstance');
const { getInstance } = require('../core/instances/getInstance');
const { getInstances } = require('../core/instances/getInstances');
const { getInstancesStatus } = require('../core/instances/getInstancesStatus');
const { removeInstance } = require('../core/instances/removeInstance');
const { searchInstances } = require('../core/instances/searchInstances');
const { sendReminder } = require('../core/instances/sendReminder');
const { updateInstance } = require('../core/instances/updateInstance');
const { getUserPermission, getUserPermissions } = require('../core/permissions/instances/users');
const { getServiceModels } = require('../models');

const { jobs } = require('./jobs/instances.job');
const restActions = require('./rest/instance.rest');

module.exports = {
  name: 'assignables.assignableInstances',
  version: 1,
  mixins: [
    LeemonsMiddlewaresMixin(),
    LeemonsCacheMixin(),
    LeemonsMongoDBMixin({
      models: getServiceModels(),
    }),
    LeemonsMQTTMixin(),
    LeemonsDeploymentManagerMixin(),
    LeemonsCronJobsMixin({ jobs }),
  ],
  actions: {
    ...restActions,
    getUserPermission: {
      handler(ctx) {
        return getUserPermission({ ...ctx.params, ctx });
      },
    },
    getUserPermissions: {
      handler(ctx) {
        return getUserPermissions({ ...ctx.params, ctx });
      },
    },
    createAssignableInstance: {
      handler(ctx) {
        return createInstance({ ...ctx.params, ctx });
      },
    },
    getAssignableInstance: {
      handler(ctx) {
        return getInstance({ ...ctx.params, ctx });
      },
    },
    getAssignableInstances: {
      handler(ctx) {
        return getInstances({ ...ctx.params, ctx });
      },
    },
    removeAssignableInstance: {
      handler(ctx) {
        return removeInstance({ ...ctx.params, ctx });
      },
    },
    updateAssignableInstance: {
      handler(ctx) {
        return updateInstance({ ...ctx.params, ctx });
      },
    },
    searchAssignableInstances: {
      handler(ctx) {
        return searchInstances({ ...ctx.params, ctx });
      },
    },
    adminDashboard: {
      handler(ctx) {
        return adminDashboard({ ...ctx.params, ctx });
      },
    },
    sendReminder: {
      handler(ctx) {
        return sendReminder({ ...ctx.params, ctx });
      },
    },
    getAssignableInstancesStatus: {
      handler(ctx) {
        return getInstancesStatus({ ...ctx.params, ctx });
      },
    },

    addStudentToOpenInstancesWithClass: {
      handler(ctx) {
        return addStudentsToOpenInstancesWithClass({ ...ctx.params, ctx });
      },
    },
  },
};
