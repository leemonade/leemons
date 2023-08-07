const getScormAssignation = require('../src/services/status/getScormAssignation');
const updateStatus = require('../src/services/status/updateStatus');

module.exports = {
  updateStatus: async (ctx) => {
    const { instance, user } = ctx.params;
    const { state } = ctx.request.body;
    const { userSession } = ctx.state;

    const status = await updateStatus({ instance, user, state }, { userSession });

    ctx.status = 200;
    ctx.body = {
      status: 200,
      scormStatus: status,
    };
  },
  getScormAssignation: async (ctx) => {
    const { instance, user } = ctx.params;
    const { userSession } = ctx.state;

    const assignation = await getScormAssignation({ instance, user }, { userSession });

    ctx.status = 200;
    ctx.body = {
      status: 200,
      assignation,
    };
  },
};
