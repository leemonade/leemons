module.exports = {
  modelName: 'teacherInstances',
  options: {
    useTimestamps: true,
  },
  attributes: {
    instance: {
      type: 'uuid',
    },
    teacher: {
      type: 'uuid',
    },
  },
};
