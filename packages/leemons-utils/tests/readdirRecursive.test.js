const path = require('path');
const fs = require('fs-extra');
const { readdirRecursive } = require('../lib/readdirRecursive');

const directoryStructure = {
  content: [
    { name: 'file1.js', path: 'file1.js', type: 'file' },
    { name: 'file2.txt', path: 'file2.txt', type: 'file' },
    {
      content: [{ name: 'subFile1.js', path: 'folder/subFile1.js', type: 'file' }],
      name: 'folder',
      path: 'folder',
      type: 'directory',
    },
  ],
  name: 'readdirrecursive',
  path: '',
  type: 'directory',
};

const directoryStructureWithChecksums = {
  name: 'readdirrecursive',
  type: 'directory',
  path: '',
  content: [
    {
      name: 'file1.js',
      path: 'file1.js',
      type: 'file',
      checksum: 'd41d8cd98f00b204e9800998ecf8427e',
    },
    {
      name: 'file2.txt',
      path: 'file2.txt',
      type: 'file',
      checksum: 'd41d8cd98f00b204e9800998ecf8427e',
    },
    {
      name: 'folder',
      type: 'directory',
      path: 'folder',
      content: [
        {
          checksum: 'd41d8cd98f00b204e9800998ecf8427e',
          name: 'subFile1.js',
          path: 'folder/subFile1.js',
          type: 'file',
        },
      ],
      checksum: 'a9a0f14c8fca110d2e6a532df8fc6ff6',
    },
  ],
  checksum: 'fcf6e1b0608ecff9a8651cafdd1eb780',
};

describe('ReaddirRecursive Functions', () => {
  describe('call readdirRecursive', () => {
    test('with empty params', async () => {
      let didThrow = false;
      await readdirRecursive().catch(() => {
        didThrow = true;
      });
      expect(didThrow).toBe(true);
    });

    test('with no existing dirname', async () => {
      let didThrow = false;
      const dir = path.join(__dirname, './files/readdirrecursive/nonExisting');
      await readdirRecursive(dir).catch(() => {
        didThrow = true;
      });
      expect(didThrow).toBe(true);
    });

    test('with existing dirname', async () => {
      const dir = path.join(__dirname, './files/readdirrecursive');
      const data = await readdirRecursive(dir);
      expect(data).toEqual(directoryStructure);
    });

    test('with existing dirname and checksums true', async () => {
      const dir = path.join(__dirname, './files/readdirrecursive');
      const data = await readdirRecursive(dir, { checksums: true });
      expect(data).toEqual(directoryStructureWithChecksums);
    });

    test('with existing dirname, json true', async () => {
      const expectedResult = {
        name: 'readdirrecursive',
        type: 'directory',
        path: '',
        content: {
          'file1.js': {
            name: 'file1.js',
            path: 'file1.js',
            type: 'file',
            checksum: 'd41d8cd98f00b204e9800998ecf8427e',
          },
          'file2.txt': {
            name: 'file2.txt',
            path: 'file2.txt',
            type: 'file',
            checksum: 'd41d8cd98f00b204e9800998ecf8427e',
          },
          folder: {
            name: 'folder',
            type: 'directory',
            path: 'folder',
            content: {
              'subFile1.js': {
                checksum: 'd41d8cd98f00b204e9800998ecf8427e',
                name: 'subFile1.js',
                path: 'folder/subFile1.js',
                type: 'file',
              },
            },
            checksum: '24ac55221fff850c9b4dfff223c2bfbe',
          },
        },
        checksum: 'ed247dafe8f96f18b28b0dc84f09bc49',
      };
      const dir = path.join(__dirname, './files/readdirrecursive');
      const data = await readdirRecursive(dir, { checksums: true, json: true });
      expect(data).toEqual(expectedResult);
    });

    test('with existing dirname, json true, empty folder', async () => {
      const expectedResult = {
        name: 'readdirrecursive',
        type: 'directory',
        path: '',
        content: {
          'file1.js': {
            name: 'file1.js',
            path: 'file1.js',
            type: 'file',
            checksum: 'd41d8cd98f00b204e9800998ecf8427e',
          },
          'file2.txt': {
            name: 'file2.txt',
            path: 'file2.txt',
            type: 'file',
            checksum: 'd41d8cd98f00b204e9800998ecf8427e',
          },
          folder: {
            name: 'folder',
            type: 'directory',
            path: 'folder',
            content: null,
            checksum: 'aeaaf0ffc18ddbcb5b06ff8c75f46afc',
          },
        },
        checksum: '8f9b4832af1c70d1a109d3005bfda235',
      };
      const dir = path.join(__dirname, './files/readdirrecursive');
      const data = await readdirRecursive(dir, {
        checksums: true,
        json: true,
        ignore: [/subFile1.js/],
      });
      expect(data).toEqual(expectedResult);
    });
    test('with existing dirname, regex for path', async () => {
      const expectedResult = {
        name: 'readdirrecursive',
        type: 'directory',
        path: '',
        content: {
          'file1.js': {
            name: 'file1.js',
            path: 'file1.js',
            type: 'file',
            checksum: 'd41d8cd98f00b204e9800998ecf8427e',
          },
          'file2.txt': {
            name: 'file2.txt',
            path: 'file2.txt',
            type: 'file',
            checksum: 'd41d8cd98f00b204e9800998ecf8427e',
          },
          folder: {
            name: 'folder',
            type: 'directory',
            path: 'folder',
            content: null,
            checksum: 'aeaaf0ffc18ddbcb5b06ff8c75f46afc',
          },
        },
        checksum: '8f9b4832af1c70d1a109d3005bfda235',
      };
      const dir = path.join(__dirname, './files/readdirrecursive');
      const data = await readdirRecursive(dir, {
        checksums: true,
        json: true,
        ignore: [/folder\/.*/],
      });
      expect(data).toEqual(expectedResult);
    });

    test('with ignore filename', async () => {
      const expectedResult = {
        name: 'readdirrecursive',
        type: 'directory',
        path: '',
        content: [
          {
            name: 'file1.js',
            path: 'file1.js',
            type: 'file',
            checksum: 'd41d8cd98f00b204e9800998ecf8427e',
          },
        ],
        checksum: 'd67c81fa637b1822b32214c6164d9076',
      };
      const dir = path.join(__dirname, './files/readdirrecursive');
      const data = await readdirRecursive(dir, {
        checksums: true,
        ignore: ['folder', 'file2.txt'],
      });
      expect(data).toEqual(expectedResult);
    });

    test('with ignore regex', async () => {
      const expectedResult = {
        name: 'readdirrecursive',
        type: 'directory',
        path: '',
        content: [
          {
            name: 'file1.js',
            path: 'file1.js',
            type: 'file',
            checksum: 'd41d8cd98f00b204e9800998ecf8427e',
          },
        ],
        checksum: 'd67c81fa637b1822b32214c6164d9076',
      };
      const dir = path.join(__dirname, './files/readdirrecursive');
      const data = await readdirRecursive(dir, {
        checksums: true,
        ignore: [/folder/, /.*\.txt/],
      });
      expect(data).toEqual(expectedResult);
    });

    test('with relative false', async () => {
      const dir = path.join(__dirname, './files/readdirrecursive');
      const expectedResult = {
        content: [
          { name: 'file1.js', path: `${dir}/file1.js`, type: 'file' },
          { name: 'file2.txt', path: `${dir}/file2.txt`, type: 'file' },
          {
            content: [{ name: 'subFile1.js', path: `${dir}/folder/subFile1.js`, type: 'file' }],
            name: 'folder',
            path: `${dir}/folder`,
            type: 'directory',
          },
        ],
        name: 'readdirrecursive',
        path: dir,
        type: 'directory',
      };

      const data = await readdirRecursive(dir, {
        checksums: false,
        relative: false,
      });
      expect(data).toEqual(expectedResult);
    });

    test('with relative to cwd', async () => {
      const dir = path.join(__dirname, './files/readdirrecursive');
      const relDir = path.relative(process.cwd(), dir);
      const expectedResult = {
        content: [
          { name: 'file1.js', path: `${relDir}/file1.js`, type: 'file' },
          { name: 'file2.txt', path: `${relDir}/file2.txt`, type: 'file' },
          {
            content: [{ name: 'subFile1.js', path: `${relDir}/folder/subFile1.js`, type: 'file' }],
            name: 'folder',
            path: `${relDir}/folder`,
            type: 'directory',
          },
        ],
        name: 'readdirrecursive',
        path: relDir,
        type: 'directory',
      };

      const data = await readdirRecursive(dir, {
        checksums: false,
        relative: process.cwd(),
      });
      expect(data).toEqual(expectedResult);
    });

    test('with file instead of dir', async () => {
      const expectedResult = {
        name: 'file1.js',
        path: '',
        type: 'file',
        checksum: 'd41d8cd98f00b204e9800998ecf8427e',
      };
      const dir = path.join(__dirname, './files/readdirrecursive/file1.js');
      const data = await readdirRecursive(dir, {
        checksums: true,
      });
      expect(data).toEqual(expectedResult);
    });

    test('with dir with symbolic link', async () => {
      const expectedResult = {
        name: 'readdirrecursive',
        type: 'directory',
        path: '',
        content: [
          {
            name: 'file1.js',
            path: 'file1.js',
            type: 'file',
            checksum: 'd41d8cd98f00b204e9800998ecf8427e',
          },
          {
            name: 'file2.txt',
            path: 'file2.txt',
            type: 'file',
            checksum: 'd41d8cd98f00b204e9800998ecf8427e',
          },
          {
            name: 'folder',
            type: 'directory',
            path: 'folder',
            content: [
              {
                checksum: 'd41d8cd98f00b204e9800998ecf8427e',
                name: 'subFile1.js',
                path: 'folder/subFile1.js',
                type: 'file',
              },
            ],
            checksum: 'a9a0f14c8fca110d2e6a532df8fc6ff6',
          },
          {
            name: 'symlink.js',
            path: 'symlink.js',
            type: 'symlink',
          },
        ],
        checksum: '13b7ee8e3bca7fcb76ad058a347f6039',
      };
      const dir = path.join(__dirname, './files/readdirrecursive');
      await fs.symlink(path.join(dir, 'file1.js'), path.join(dir, 'symlink.js'));
      const data = await readdirRecursive(dir, {
        checksums: true,
      });
      await fs.remove(path.join(dir, 'symlink.js'));
      expect(data).toEqual(expectedResult);
    });

    test('with symbolic link', async () => {
      const expectedResult = {
        name: 'symlink.js',
        path: '',
        type: 'symlink',
        checksum: 'd41d8cd98f00b204e9800998ecf8427e',
      };
      const dir = path.join(__dirname, './files/readdirrecursive/symlink.js');
      await fs.symlink(path.join(dir, '../file1.js'), dir);
      const data = await readdirRecursive(dir, {
        checksums: true,
      });
      await fs.remove(dir);
      expect(data).toEqual(expectedResult);
    });

    test('with symbolic link and absolute path', async () => {
      const dir = path.join(__dirname, './files/readdirrecursive/symlink.js');
      const expectedResult = {
        name: 'symlink.js',
        path: `/${path.relative('/', dir)}`,
        type: 'symlink',
      };
      await fs.symlink(path.join(dir, '../file1.js'), dir);
      const data = await readdirRecursive(dir, {
        checksums: false,
        relative: false,
      });
      await fs.remove(dir);
      expect(data).toEqual(expectedResult);
    });

    test("don't throw when missing file", async () => {
      let didThrow = false;
      const dir = path.join(__dirname, '/files/readdirrecursive/notExists');
      const data = await readdirRecursive(dir, { throwOnMissing: false }).catch(() => {
        didThrow = true;
      });

      expect(didThrow).toBeFalsy();
      expect(data).toBeNull();
    });
  });
});
