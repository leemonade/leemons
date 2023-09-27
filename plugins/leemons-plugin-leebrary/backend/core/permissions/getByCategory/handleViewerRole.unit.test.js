const { it, expect } = require('@jest/globals');
const { generateCtx } = require('@leemons/testing');

const { handleViewerRole } = require('./handleViewerRole');
const { rolesPermissions } = require('../../../config/constants');

it('should return the correct viewer role permissions', () => {
  const viewItems = ['asset1', 'asset2'];
  const results = [];
  const assetIds = ['asset1', 'asset2'];
  const ctx = generateCtx({});

  const expectedResults = [
    {
      asset: 'asset1',
      role: 'viewer',
      permissions: rolesPermissions.viewer,
    },
    {
      asset: 'asset2',
      role: 'viewer',
      permissions: rolesPermissions.viewer,
    },
  ];

  const actualResults = handleViewerRole({ viewItems, results, assetIds, ctx });

  expect(actualResults).toEqual(expectedResults);
});

it('should not add viewer role permissions for assets not included in assetIds', () => {
  const viewItems = ['asset1', 'asset2'];
  const results = [];
  const assetIds = ['asset1'];
  const ctx = generateCtx({});

  const expectedResults = [
    {
      asset: 'asset1',
      role: 'viewer',
      permissions: rolesPermissions.viewer,
    },
  ];

  const actualResults = handleViewerRole({ viewItems, results, assetIds, ctx });

  expect(actualResults).toEqual(expectedResults);
});

it('should not add viewer role permissions for assets already included in results', () => {
  const viewItems = ['asset1', 'asset2'];
  const results = [
    {
      asset: 'asset1',
      role: 'viewer',
      permissions: rolesPermissions.viewer,
    },
  ];
  const assetIds = ['asset1', 'asset2'];
  const ctx = generateCtx({});

  const expectedResults = [
    {
      asset: 'asset1',
      role: 'viewer',
      permissions: rolesPermissions.viewer,
    },
    {
      asset: 'asset2',
      role: 'viewer',
      permissions: rolesPermissions.viewer,
    },
  ];

  const actualResults = handleViewerRole({ viewItems, results, assetIds, ctx });

  expect(actualResults).toEqual(expectedResults);
});
