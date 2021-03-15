module.exports = {
  collectionName: 'restaurants',
  info: {
    name: 'restaurantes',
    description: 'Los restaurantes',
  },
  options: {},
  attributes: {
    name: {
      type: 'string',
    },
    direction: {
      references: {
        collection: 'global.direction',
        relation: 'one to one',
      },
    },
    menu: {
      references: {
        collection: 'global.menu',
        relation: 'many to many',
      },
    },
    category: {
      references: {
        collection: 'global.category',
        relation: 'one to many',
      },
    },
    test: {
      type: 'string',
    },
  },
};
