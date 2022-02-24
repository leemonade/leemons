module.exports = {
  modelName: 'userInstances',
  attributes: {
    instance: {
      type: 'uuid',
    },
    user: {
      type: 'uuid',
    },
    opened: {
      type: 'datetime',
    },
    start: {
      type: 'datetime',
    },
    end: {
      type: 'datetime',
    },
    // EN: Type of assignment: ['direct', 'group']
    // ES: Tipo de asignación: ['directa', 'grupal']
    type: {
      type: 'string',
    },
  },
};
