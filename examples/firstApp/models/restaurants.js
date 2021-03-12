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
        collection: 'direction',
        relation: 'one to one',
      },
    },
    menu: {
      references: {
        collection: 'menu',
        relation: 'many to many',
      },
    },
    category: {
      references: {
        collection: 'category',
        relation: 'one to many',
      },
    },
  },
};
