module.exports = {
  modelName: 'rules',
  collectionName: 'rules',
  options: {
    useTimestamps: true,
  },
  attributes: {
    name: {
      type: 'string',
      options: {
        notNull: true,
      },
    },
    center: {
      references: {
        collection: 'plugins_users::centers',
      },
    },
    grade: {
      references: {
        collection: 'plugins_grades::grades',
      },
    },
    program: {
      type: 'string',
      /*
       references: {
        collection: 'plugins_academic-portfolio::programs',
      },
      */
    },
    // ES: Grupo desde el que empezar a evaluar las condiciones
    // EN: Group from which start to evaluate the conditions
    group: {
      references: {
        collection: 'plugins_grades::condition-groups',
      },
    },
    isDependency: {
      type: 'boolean',
      options: {
        defaultTo: false,
        notNull: true,
      },
    },
    subject: {
      type: 'string',
      /*
      references: {
        collection: 'plugins_academic-portfolio::subjects',
      },
      */
    },
  },
  primaryKey: {
    type: 'uuid',
  },
};
