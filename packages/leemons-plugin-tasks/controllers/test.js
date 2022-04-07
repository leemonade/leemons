const _ = require('lodash');
const parseVersion = require('../src/services/task/helpers/parseVersion');
const create = require('../src/services/versionControl/currentVersions/create');
const remove = require('../src/services/versionControl/currentVersions/remove');
const createVersion = require('../src/services/versionControl/versions/createVersion');
const {
  parseId,
  isValidVersion,
  stringifyId,
  stringifyVersion,
} = require('../src/services/versionControl/helpers');
const { removeVersion } = require('../src/services/versionControl/versions');

async function testExecuter(name, fn, i, shouldThrow = false) {
  const success = (...result) => {
    console.log(`${i} - ✅ ${name}`);
    console.log('>', ...result);
  };
  const failure = (...error) => {
    console.log(`${i} - ❌ ${name}`);
    console.log('>', ...error);
  };
  try {
    const result = await fn();

    if (shouldThrow === true) {
      failure('Should have thrown an error', result);
    } else if (typeof shouldThrow === 'function') {
      const equals = shouldThrow(result);

      if (equals) {
        success(result);
      } else {
        failure(result);
      }
    } else {
      success(result);
    }
  } catch (e) {
    if (shouldThrow === true) {
      success('Did throw an error: ', e.message);
    } else {
      failure('Should not have thrown an error: ', e);
    }
  }
}

async function test(tests) {
  for (let i = 0; i < tests.length; i++) {
    const [name, fn, shouldThrow] = tests[i];
    await testExecuter(name, fn, i, shouldThrow);
  }
}

test([
  // #region helpers
  // #region parseId
  [
    'parseId Valid',
    () => parseId('uuid', '1.0.0'),
    (r) => _.isEqual({ uuid: 'uuid', version: '1.0.0', fullId: 'uuid@1.0.0' }, r),
  ],
  ['parseId Invalid', () => parseId('uuid', 'pepe'), true],
  [
    'parseId valid (no verify)',
    () => parseId('uuid', '1.0.0', { verifyVersion: false }),
    (r) => _.isEqual({ uuid: 'uuid', version: '1.0.0', fullId: 'uuid@1.0.0' }, r),
  ],
  [
    'parseId Invalid (no verify)',
    () => parseId('uuid', 'pepe', { verifyVersion: false }),
    (r) => _.isEqual({ uuid: 'uuid', version: 'pepe', fullId: 'uuid@pepe' }, r),
  ],
  ['parseId invalid id', () => parseId(23, '1.0.0'), true],
  // #endregion

  // #region stringifyId
  ['stringifyId valid', () => stringifyId('uuid', '1.0.0'), (r) => r === 'uuid@1.0.0'],
  ['stringifyId invalid', () => stringifyId('uuid', 'pepe'), true],
  ['stringifyId invalid id', () => stringifyId(23, '1.0.0'), true],
  [
    'stirngifyId valid version (no verify)',
    () => stringifyId('uuid', '1.0.0', { verifyVersion: false }),
    (r) => r === 'uuid@1.0.0',
  ],
  [
    'stringifyId invalid version (no verify)',
    () => stringifyId('uuid', 'pepe', { verifyVersion: false }),
    (r) => r === 'uuid@pepe',
  ],
  // #endregion

  // #region isValidVersion
  ['verifyVersion valid', () => isValidVersion('1.0.0'), (v) => v === true],
  ['verifyVersion invalid', () => isValidVersion('pepe'), (v) => v === false],
  // #endregion

  // #region parseVersion
  [
    'parseVersion valid',
    () => parseVersion('1.0.0'),
    (v) => _.isEqual(v, { major: 1, minor: 0, patch: 0 }),
  ],
  ['parseVersion invalid', () => parseVersion('pepe'), true],
  // #endregion

  // #region stringifyVersion
  [
    'stringifyVersion valid',
    () => stringifyVersion({ major: 1, minor: 0, patch: 0 }),
    (v) => v === '1.0.0',
  ],
  [
    'stringifyVersion invalid (major)',
    () => stringifyVersion({ major: 'hola', minor: 0, patch: 0 }),
    true,
  ],
  [
    'stringifyVersion invalid (minor)',
    () => stringifyVersion({ major: 1, minor: 'hola', patch: 0 }),
    true,
  ],
  [
    'stringifyVersion invalid (patch)',
    () => stringifyVersion({ major: 1, minor: 0, patch: 'hola' }),
    true,
  ],
  ['stringifyVersion invalid no object', () => stringifyVersion('hola'), true],
  // #endregion
  // #endregion

  // #region currentVersions
  // [
  //   'currentVersions create (published)',
  //   async () => create({ published: true }),
  //   (v) => v.currentPublished === '1.0.0',
  // ],
  // [
  //   'currentVersions create (not published)',
  //   async () => create(),
  //   (v) => v.currentPublished === null,
  // ],
  // [
  //   'currentVersions remove (published existing (no draft))',
  //   async () => {
  //     const id = await create({ published: true });
  //     return remove(id.uuid, true);
  //   },
  // ],
  // [
  //   'currentVersions remove (published existing (draft))',
  //   async () => {
  //     const id = await create({ published: true });
  //     await createVersion(id.uuid, { version: '1.0.1', published: false });
  //     return remove(id.uuid, true);
  //   },
  // ],
  // ['currentVersions remove (published not existing (no draft))', async () => remove('uuid', true)],
  // [
  //   'currentVersions remove (published not existing (draft))',
  //   async () => {
  //     const id = await create({ published: true });
  //     return remove(id.uuid, true);
  //   },
  // ],
  // [
  //   'currentVersions remove (draft existing (no published))',
  //   async () => {
  //     const id = await create({ published: false });
  //     return remove(id.uuid, false);
  //   },
  // ],
  // [
  //   'currentVersions remove (draft existing (published))',
  //   async () => {
  //     const id = await create({ published: true });
  //     await createVersion(id.uuid, { version: '1.0.1', published: false });
  //     return remove(id.uuid, false);
  //   },
  // ],
  // [
  //   'currentVersions remove (draft not existing (published))',
  //   async () => {
  //     const id = await create({ published: true });
  //     return remove(id.uuid, false);
  //   },
  // ],

  // #endregion

  // #region versions
  [
    'versions create (published)',
    () => createVersion('uuid', { version: '1.0.0', published: true }),
  ],
  [
    'versions create (not published)',
    () => createVersion('uuid2', { version: '1.0.0', published: false }),
  ],
  [
    'versions remove fullId (published existing)',
    async () => {
      await createVersion('uuid3', { version: '1.0.0', published: true });
      return removeVersion('uuid3@1.0.0', { published: true });
    },
  ],
  [
    'versions remove version (published existing)',
    async () => {
      await createVersion('uuid4', { version: '1.0.0', published: true });
      return removeVersion('uuid4', { published: true, version: '1.0.0' });
    },
  ],
  [
    'versions remove fullId (published not existing)',
    async () => {
      await createVersion('uuid5', { version: '1.0.0', published: false });
      return removeVersion('uuid5@1.0.0', { published: true });
    },
  ],
  // #endregion
]);
