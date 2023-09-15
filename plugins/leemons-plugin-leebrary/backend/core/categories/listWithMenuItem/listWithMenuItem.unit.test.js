const { it, expect } = require('@jest/globals');
const { generateCtx } = require('@leemons/testing');

const getMenuItems = require('../../../__fixtures__/getMenuItems');
const getCategory = require('../../../__fixtures__/getCategory');

const { listWithMenuItem } = require('./listWithMenuItem');

jest.mock('../list');
const { list } = require('../list');

const { menuItems } = getMenuItems();
const categoryData = getCategory().categoryObject;
const getIfHasPermissionHandler = jest.fn().mockReturnValue(menuItems);
const ctx = generateCtx({
  actions: {
    'menu-builder.menu.getIfHasPermission': getIfHasPermissionHandler,
  },
  pluginName: 'leebrary',
});

it('Should return a list of categories with menuItems', async () => {
  // Arrange
  const categories = [
    { ...categoryData, id: 'id1', key: 'media-files' },
    { ...categoryData, id: 'id2', key: 'assignables.feedback' },
    { ...categoryData, id: 'id3', key: 'assignables.task' },
  ];
  list.mockReturnValue({
    count: 3,
    totalCount: 3,
    totalPages: 1,
    page: 0,
    size: 10,
    nextPage: 0,
    prevPage: 0,
    canGoPrevPage: false,
    canGoNextPage: false,
    items: categories,
  });

  // Act
  const response = await listWithMenuItem({ ctx });

  // Assert
  for (let i = 0; i < response.length; i += 1) {
    expect(response[i].menuItem).toBeDefined();
    // Assert order of menuItems
    if (i < response.length - 1)
      expect(response[i].menuItem.order - response[i + 1].menuItem.order).toBeLessThanOrEqual(0);
  }
});

it('Should not return a category if its key is not contained in menuItems keys', async () => {
  // Arrange
  const categories = [{ ...categoryData, id: 'id1', key: 'non-existing-key' }];
  list.mockReturnValue({
    count: 1,
    totalCount: 1,
    totalPages: 1,
    page: 0,
    size: 10,
    nextPage: 0,
    prevPage: 0,
    canGoPrevPage: false,
    canGoNextPage: false,
    items: categories,
  });

  // Act
  const response = await listWithMenuItem({ ctx });

  // Assert
  expect(response).toHaveLength(0);
});
