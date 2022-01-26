module.exports = {
  modelName: 'userDeliverables',
  attributes: {
    instance: {
      type: 'uuid',
    },
    user: {
      type: 'uuid',
    },
    deliverable: {
      type: 'string',
    },
    // EN: Type of assignment: ['direct', 'group']
    // ES: Tipo de asignación: ['directa', 'grupal']
    type: {
      type: 'string',
    },
  },
};
