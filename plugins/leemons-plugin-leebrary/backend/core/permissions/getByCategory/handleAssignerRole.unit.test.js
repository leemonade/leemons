const { it, expect } = require('@jest/globals');
const { generateCtx } = require('@leemons/testing');

const { handleAssignerRole } = require('./handleAssignerRole');
const { rolesPermissions } = require('../../../config/constants');

it('should return the correct assigner role permissions', () => {
  const assignItems = ['asset1', 'asset2'];
  const results = [];
  const assetIds = ['asset1', 'asset2'];
  const ctx = generateCtx({});

  const expectedResults = [
    {
      asset: 'asset1',
      role: 'assigner',
      permissions: rolesPermissions.assigner,
    },
    {
      asset: 'asset2',
      role: 'assigner',
      permissions: rolesPermissions.assigner,
    },
  ];

  const actualResults = handleAssignerRole({ assignItems, results, assetIds, ctx });

  expect(actualResults).toEqual(expectedResults);
});

it('should not add assigner role permissions for assets not included in assetIds', () => {
  const assignItems = ['asset1', 'asset2'];
  const results = [];
  const assetIds = ['asset1'];
  const ctx = generateCtx({});

  const expectedResults = [
    {
      asset: 'asset1',
      role: 'assigner',
      permissions: rolesPermissions.assigner,
    },
  ];

  const actualResults = handleAssignerRole({ assignItems, results, assetIds, ctx });

  expect(actualResults).toEqual(expectedResults);
});

it('should not add assigner role permissions for assets already included in results but it should correct them if necessary', () => {
  const assignItems = ['asset1', 'asset2'];
  const results = [
    {
      asset: 'asset1',
      role: 'assigner',
      permissions: rolesPermissions.assigner,
    },
    {
      asset: 'asset2',
      role: 'viewer',
      permissions: rolesPermissions.assigner,
    },
  ];
  const assetIds = ['asset1', 'asset2'];
  const ctx = generateCtx({});

  const expectedResults = [
    {
      asset: 'asset1',
      role: 'assigner',
      permissions: rolesPermissions.assigner,
    },
    {
      asset: 'asset2',
      role: 'assigner',
      permissions: rolesPermissions.assigner,
    },
  ];

  const actualResults = handleAssignerRole({ assignItems, results, assetIds, ctx });

  expect(actualResults).toEqual(expectedResults);
});
