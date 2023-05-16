module.exports = {
  modelName: 'periods',
  attributes: {
    center: {
      type: 'uuid',
      options: {
        notNull: true,
      },
    },
    program: {
      type: 'uuid',
      options: {
        notNull: true,
      },
    },
    course: {
      type: 'uuid',
    },
    name: {
      type: 'string',
    },
    startDate: {
      type: 'datetime',
    },
    endDate: {
      type: 'datetime',
    },
    createdBy: {
      type: 'uuid',
    },
    public: {
      type: 'boolean',
    },
  },
};
