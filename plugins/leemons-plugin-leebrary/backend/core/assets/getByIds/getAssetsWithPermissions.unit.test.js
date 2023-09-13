/* eslint-disable sonarjs/no-duplicate-string */
const {
  it,
  expect,
  jest: { fn },
} = require('@jest/globals');
const { generateCtx } = require('leemons-testing');

const { getAssetsWithPermissions } = require('./getAssetsWithPermissions');
const getUserSession = require('../../../__fixtures__/getUserSession');
const getPermissionsMocks = require('../../../__fixtures__/getPermissionsMocks');

// MOCKS
jest.mock('../../permissions/getClassesPermissions');
jest.mock('../../permissions/getByAssets');
jest.mock('../../permissions/helpers/canUnassignRole');
const { getClassesPermissions } = require('../../permissions/getClassesPermissions');
const { getByAssets: getPermissions } = require('../../permissions/getByAssets');
const canUnassignRole = require('../../permissions/helpers/canUnassignRole');

const userSession = getUserSession();
const { userAgentPermissionAsset } = getPermissionsMocks();
const assets = [{ id: 'assetOne' }, { id: 'assetTwo' }, { id: 'assetThree' }];
const assetsIds = assets.map((asset) => asset.id);

it('Should correctly call external services', async () => {
  const findUsersWithPermissions = fn(() => [
    { ...userAgentPermissionAsset },
    {
      ...userAgentPermissionAsset,
      id: 'userAgentPermissionTwo',
      userAgent: 'userAgentId2',
      permissionName: 'leemons-testing.(ASSET_ID)assetTwo',
      actionName: 'viewer',
    },
    {
      ...userAgentPermissionAsset,
      id: 'userAgentPermissionThree',
      userAgent: 'userAgentId3',
      permissionName: 'leemons-testing.(ASSET_ID)assetTwo',
      actionName: 'edit',
    },
  ]);
  const getUserAgentsInfoAction = fn(() => [
    {
      id: userAgentPermissionAsset.userAgent,
      user: {
        id: 'userId1',
        email: 'user1@example.com',
        name: 'User1',
        surnames: 'Surname1',
        secondSurname: 'SecondSurname1',
        birthdate: '1990-01-01',
        avatar: 'avatar1.png',
        gender: 'male',
      },
      role: 'role1',
      disabled: null,
    },
    {
      id: 'userAgentId2',
      user: {
        id: 'userId2',
        email: 'user2@example.com',
        name: 'User2',
        surnames: 'Surname2',
        secondSurname: 'SecondSurname2',
        birthdate: '1992-01-01',
        avatar: 'avatar2.png',
        gender: 'female',
      },
      role: 'role2',
      disabled: null,
    },
    {
      id: 'userAgentId3',
      user: {
        id: 'userId2',
        email: 'user2@example.com',
        name: 'User2',
        surnames: 'Surname2',
        secondSurname: 'SecondSurname2',
        birthdate: '1992-01-01',
        avatar: 'avatar2.png',
        gender: 'female',
      },
      role: 'role2',
      disabled: null,
    },
  ]);

  const ctx = generateCtx({
    actions: {
      'users.permissions.findUsersWithPermissions': findUsersWithPermissions,
      'users.users.getUserAgentsInfo': getUserAgentsInfoAction,
    },
  });
  ctx.meta.userSession = { ...userSession };

  getClassesPermissions.mockResolvedValue([
    [
      {
        id: 'classId1',
        subject: 'subjectId1',
        fullName: 'Full Name 1',
        icon: 'icon1',
        color: 'color1',
        class: 'classId1',
        role: 'editor',
      },
    ],
    [],
    [],
  ]);
  getPermissions.mockResolvedValue([
    {
      asset: 'assetOne',
      role: 'owner',
      permissions: {
        assign: true,
        view: true,
        edit: true,
        duplicate: true,
        delete: true,
        comment: true,
        canAssign: ['assigner', 'viewer', 'commentor', 'editor', 'owner'],
        canUnassign: ['assigner', 'viewer', 'commentor', 'editor'],
      },
    },
    {
      asset: 'assetTwo',
      role: 'editor',
      permissions: {
        view: true,
        edit: false,
        duplicate: false,
        delete: false,
        comment: true,
        canAssign: ['assigner', 'viewer', 'commentor', 'editor', 'owner'],
        canUnassign: ['assigner', 'viewer', 'commentor', 'editor'],
      },
    },
  ]);
  canUnassignRole.mockReturnValue(true);

  const expectedResult = [
    {
      ...assets[0],
      isPrivate: false,
      classesCanAccess: [
        {
          id: 'classId1',
          subject: 'subjectId1',
          fullName: 'Full Name 1',
          icon: 'icon1',
          color: 'color1',
          class: 'classId1',
          role: 'editor',
        },
      ],
      canAccess: [
        {
          id: 'userId1',
          email: 'user1@example.com',
          name: 'User1',
          surnames: 'Surname1',
          secondSurname: 'SecondSurname1',
          birthdate: '1990-01-01',
          avatar: 'avatar1.png',
          gender: 'male',
          userAgentIds: [userAgentPermissionAsset.userAgent],
          permissions: [userAgentPermissionAsset.actionName],
          editable: true,
        },
      ],
    },
    {
      ...assets[1],
      isPrivate: false,
      classesCanAccess: [],
      // canAccess: [
      //   {
      //     id: 'userId2',
      //     email: 'user2@example.com',
      //     name: 'User2',
      //     surnames: 'Surname2',
      //     secondSurname: 'SecondSurname2',
      //     birthdate: '1992-01-01',
      //     avatar: 'avatar2.png',
      //     gender: 'female',
      //     permissions: ['editor'],
      //     userAgentIds: ['userAgentId2'],
      //     editable: true,
      //   },
      // ],
      canAccess: null,
    },
  ];

  const result = await getAssetsWithPermissions({ assets, assetsIds, ctx });

  expect(getClassesPermissions).toBeCalledWith({
    assetsIds,
    withInfo: true,
    ctx,
  });
  expect(getPermissions).toBeCalledWith({
    assetsIds,
    showPublic: undefined,
    ctx,
  });
  expect(findUsersWithPermissions).toBeCalledWith({
    permissions: {
      permissionName: ['leemons-testing.(ASSET_ID)assetOne', 'leemons-testing.(ASSET_ID)assetTwo'],
    },
    returnRaw: true,
  });
  expect(getUserAgentsInfoAction).toBeCalledWith({
    userAgentIds: ['userAgentId1', 'userAgentId2', 'userAgentId3'],
  });
  expect(result).toEqual(expectedResult);
});

// it('Should correctly return assets with permissions', async () => {});
// it('No permissions by asset are found')

it('Should correctly handle owner permissions', async () => {
  const findUsersWithPermissions = fn(() => [
    { ...userAgentPermissionAsset },
    {
      ...userAgentPermissionAsset,
      id: 'userAgentPermissionTwo',
      userAgent: 'userAgentId2',
      permissionName: 'leemons-testing.(ASSET_ID)assetTwo',
      actionName: 'owner',
    },
  ]);
  const getUserAgentsInfoAction = fn(() => [
    {
      id: userAgentPermissionAsset.userAgent,
      user: {
        id: 'userId1',
        email: 'user1@example.com',
        name: 'User1',
        surnames: 'Surname1',
        secondSurname: 'SecondSurname1',
        birthdate: '1990-01-01',
        avatar: 'avatar1.png',
        gender: 'male',
      },
      role: 'role1',
      disabled: null,
    },
    {
      id: 'userAgentId2',
      user: {
        id: 'userId2',
        email: 'user2@example.com',
        name: 'User2',
        surnames: 'Surname2',
        secondSurname: 'SecondSurname2',
        birthdate: '1992-01-01',
        avatar: 'avatar2.png',
        gender: 'female',
      },
      role: 'role2',
      disabled: null,
    },
    {
      id: 'userAgentId3',
      user: {
        id: 'userId2',
        email: 'user2@example.com',
        name: 'User2',
        surnames: 'Surname2',
        secondSurname: 'SecondSurname2',
        birthdate: '1992-01-01',
        avatar: 'avatar2.png',
        gender: 'female',
      },
      role: 'role2',
      disabled: null,
    },
  ]);

  const ctx = generateCtx({
    actions: {
      'users.permissions.findUsersWithPermissions': findUsersWithPermissions,
      'users.users.getUserAgentsInfo': getUserAgentsInfoAction,
    },
  });
  ctx.meta.userSession = { ...userSession };

  getClassesPermissions.mockResolvedValue([[], [], []]);
  getPermissions.mockResolvedValue([
    {
      asset: 'assetTwo',
      role: 'owner',
      permissions: {
        view: true,
        edit: false,
        duplicate: false,
        delete: false,
        comment: true,
        canAssign: ['assigner', 'viewer', 'commentor', 'editor', 'owner'],
        canUnassign: ['assigner', 'viewer', 'commentor', 'editor'],
      },
    },
  ]);
  canUnassignRole.mockReturnValue(true);

  const expectedResult = [
    {
      ...assets[1],
      isPrivate: true,
      classesCanAccess: [],
      canAccess: [
        {
          id: 'userId2',
          email: 'user2@example.com',
          name: 'User2',
          surnames: 'Surname2',
          secondSurname: 'SecondSurname2',
          birthdate: '1992-01-01',
          avatar: 'avatar2.png',
          gender: 'female',
          permissions: ['owner'],
          userAgentIds: ['userAgentId2'],
          editable: true,
        },
      ],
    },
  ];

  const result = await getAssetsWithPermissions({ assets, assetsIds, ctx });

  expect(result).toEqual(expectedResult);
});
