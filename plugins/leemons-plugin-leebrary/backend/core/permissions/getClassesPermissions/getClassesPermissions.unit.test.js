/* eslint-disable sonarjs/no-duplicate-string */
const {
  it,
  expect,
  jest: { fn },
} = require('@jest/globals');
const { generateCtx } = require('@leemons/testing');
const { escapeRegExp } = require('lodash');

const { getClassesPermissions } = require('./getClassesPermissions');

it('Should correctly retreive a class permissions and the class info', async () => {
  // Arrange
  const assetsIds = ['assetOne', 'assetTwo'];
  const findItems = fn().mockResolvedValue([
    { permissionName: 'academic-portfolio.class.classOne', item: assetsIds[0] },
    {
      permissionName: 'academic-portfolio.class.classTwo',
      item: assetsIds[0],
      type: 'leemons-testing.asset.can-edit',
    },
    {
      permissionName: 'academic-portfolio.class.classTwo',
      item: assetsIds[1],
      type: 'leemons-testing.asset.can-assign',
    },
  ]);
  const classByIds = fn().mockResolvedValue([
    {
      id: 'classOne',
      subject: { id: 'subjectOneId', name: 'subjectOne', icon: 'iconUrl' },
      groups: { isAlone: true },
      color: '#FF0000',
    },
    {
      id: 'classTwo',
      subject: { id: 'subjectTwoId', name: 'subjectTwo', icon: 'iconUrl' },
      groups: { isAlone: false, name: 'groupName' },
      color: '#000000',
    },
  ]);

  const ctx = generateCtx({
    actions: {
      'users.permissions.findItems': findItems,
      'academic-portfolio.classes.classByIds': classByIds,
    },
  });
  const expectedResponse = [
    [
      {
        id: 'classOne',
        subject: 'subjectOneId',
        fullName: 'subjectOne',
        icon: 'iconUrl',
        color: '#FF0000',
        class: 'classOne',
        role: 'viewer',
      },
      {
        id: 'classTwo',
        subject: 'subjectTwoId',
        fullName: 'subjectTwo - groupName',
        icon: 'iconUrl',
        color: '#000000',
        class: 'classTwo',
        role: 'editor',
      },
    ],
    [
      {
        id: 'classTwo',
        subject: 'subjectTwoId',
        fullName: 'subjectTwo - groupName',
        icon: 'iconUrl',
        color: '#000000',
        class: 'classTwo',
        role: 'assigner',
      },
    ],
  ];

  // Act
  const response = await getClassesPermissions({ assetsIds, withInfo: true, ctx });

  // Assert
  expect(findItems).toBeCalledWith({
    params: {
      item: assetsIds,
      permissionName: { $regex: `^${escapeRegExp('academic-portfolio.class.')}` },
      type: { $regex: `^${escapeRegExp(ctx.prefixPN('asset'))}` },
    },
  });
  expect(classByIds).toBeCalledWith({ ids: ['classOne', 'classTwo'] });
  expect(response).toEqual(expectedResponse);
});

it('Should get pemissions by class without info', async () => {
  // Arrange
  const assetsIds = ['assetOne', 'assetTwo'];
  const findItems = fn().mockResolvedValue([
    { permissionName: 'academic-portfolio.class.classOne', item: assetsIds[0] },
    {
      permissionName: 'academic-portfolio.class.classTwo',
      item: assetsIds[0],
      type: 'leemons-testing.asset.can-edit',
    },
    {
      permissionName: 'academic-portfolio.class.classTwo',
      item: assetsIds[1],
      type: 'leemons-testing.asset.can-assign',
    },
  ]);
  const classByIds = fn().mockResolvedValue([
    {
      id: 'classOne',
      subject: { id: 'subjectOneId', name: 'subjectOne', icon: 'iconUrl' },
      groups: { isAlone: true },
      color: '#FF0000',
    },
    {
      id: 'classTwo',
      subject: { id: 'subjectTwoId', name: 'subjectTwo', icon: 'iconUrl' },
      groups: { isAlone: false, name: 'groupName' },
      color: '#000000',
    },
  ]);

  const ctx = generateCtx({
    actions: {
      'users.permissions.findItems': findItems,
      'academic-portfolio.classes.classByIds': classByIds,
    },
  });
  const expectedResponse = [
    [
      {
        class: 'classOne',
        role: 'viewer',
      },
      {
        class: 'classTwo',
        role: 'editor',
      },
    ],
    [
      {
        class: 'classTwo',
        role: 'assigner',
      },
    ],
  ];

  // Act
  const response = await getClassesPermissions({ assetsIds, ctx });

  // Assert
  expect(classByIds).not.toBeCalled();
  expect(response).toEqual(expectedResponse);
});

it('Should return an empty value if a class does not have any permissions', async () => {
  // Arrange
  const assetsIds = 'assetOne';
  const findItems = fn().mockResolvedValue([
    { permissionName: 'academic-portfolio.class.classOne', item: 'otherAsset' },
  ]);
  const classByIds = fn();

  const ctx = generateCtx({
    actions: {
      'users.permissions.findItems': findItems,
      'academic-portfolio.classes.classByIds': classByIds,
    },
  });

  // Act
  const response = await getClassesPermissions({ assetsIds, ctx });

  // Assert
  expect(classByIds).not.toBeCalled();
  expect(response).toEqual([[]]);
});

it('Should not call classByIds if no classes have permissions', async () => {
  // Arrange
  const assetsIds = ['assetOne'];
  const findItems = fn().mockResolvedValue([]);
  const classByIds = fn();

  const ctx = generateCtx({
    actions: {
      'users.permissions.findItems': findItems,
      'academic-portfolio.classes.classByIds': classByIds,
    },
  });

  const expectedResponse = [[]];

  // Act
  const response = await getClassesPermissions({ assetsIds, withInfo: true, ctx });

  // Assert
  expect(findItems).toBeCalledWith({
    params: {
      item: assetsIds,
      permissionName: { $regex: `^${escapeRegExp('academic-portfolio.class.')}` },
      type: { $regex: `^${escapeRegExp(ctx.prefixPN('asset'))}` },
    },
  });
  expect(classByIds).not.toBeCalled();
  expect(response).toEqual(expectedResponse);
});
