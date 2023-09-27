const { it, expect } = require('@jest/globals');
const { generateCtx } = require('@leemons/testing');

const { handleEditorRole } = require('./handleEditorRole');
const { rolesPermissions } = require('../../../config/constants');

it('should return the correct editor role permissions', () => {
  const editItems = ['asset1', 'asset2'];
  const results = [];
  const assetIds = ['asset1', 'asset2'];
  const ctx = generateCtx({});

  const expectedResults = [
    {
      asset: 'asset1',
      role: 'editor',
      permissions: rolesPermissions.editor,
    },
    {
      asset: 'asset2',
      role: 'editor',
      permissions: rolesPermissions.editor,
    },
  ];

  const actualResults = handleEditorRole({ editItems, results, assetIds, ctx });

  expect(actualResults).toEqual(expectedResults);
});

it('should not add editor role permissions for assets not included in assetIds', () => {
  const editItems = ['asset1', 'asset2'];
  const results = [];
  const assetIds = ['asset1'];
  const ctx = generateCtx({});

  const expectedResults = [
    {
      asset: 'asset1',
      role: 'editor',
      permissions: rolesPermissions.editor,
    },
  ];

  const actualResults = handleEditorRole({ editItems, results, assetIds, ctx });

  expect(actualResults).toEqual(expectedResults);
});

it('should not add editor role permissions for assets already included in results but it should correct them if necessary', () => {
  const editItems = ['asset1', 'asset2'];
  const results = [
    {
      asset: 'asset1',
      role: 'editor',
      permissions: rolesPermissions.editor,
    },
    {
      asset: 'asset2',
      role: 'viewer',
      permissions: rolesPermissions.editor,
    },
  ];
  const assetIds = ['asset1', 'asset2'];
  const ctx = generateCtx({});

  const expectedResults = [
    {
      asset: 'asset1',
      role: 'editor',
      permissions: rolesPermissions.editor,
    },
    {
      asset: 'asset2',
      role: 'editor',
      permissions: rolesPermissions.editor,
    },
  ];

  const actualResults = handleEditorRole({ editItems, results, assetIds, ctx });

  expect(actualResults).toEqual(expectedResults);
});
