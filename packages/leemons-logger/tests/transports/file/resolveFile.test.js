// TODO: Test errors: on file read, on gzip error, on gzip save error

const path = require('path');
const fs = require('fs-extra');
const resolveFile = require('../../../lib/transports/file/resolveFile');

describe('Test resolveFile', () => {
  const dir = path.join(__dirname, 'testOutput');

  describe.each([
    ['existing folder (1 depth)', { shouldDirExist: true }],
    [
      'custom folder, existing folder (5 depth)',
      {
        folder: path.join(dir, 'level2', 'level3', 'level4', 'logs'),
        shouldDirExist: true,
      },
    ],
    ['non-existing folder (1 depth)'],
    [
      'custom folder, non-existing folder (5 depth)',
      {
        folder: path.join(dir, 'level2', 'level3', 'level4', 'logs'),
      },
    ],
    [
      'existing file',
      {
        shouldAlreadyExist: true,
        id: '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d',
      },
    ],
    [
      'custom folder, existing file (5 depth)',
      {
        folder: path.join(dir, 'level2', 'level3', 'level4', 'logs'),
        shouldAlreadyExist: true,
        id: '9c1deb4d-57d4-4bad-9bdd-2b0d7b3dcb6d',
      },
    ],
    [
      'non-existing file with id',
      {
        id: '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d',
      },
    ],
    [
      'custom folder, non-existing file (5 depth) with id',
      {
        folder: path.join(dir, 'level2', 'level3', 'level4', 'logs'),
        id: '9c1deb4d-57d4-4bad-9bdd-2b0d7b3dcb6d',
      },
    ],
    [
      'existing file with different id',
      {
        id: '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d',
        existingId: '9b1deb4d-3b7d-4bad-9bdd-13acdf89756c',
        shouldAlreadyExist: true,
      },
    ],
    [
      'custom folder, existing file (5 depth) with different id',
      {
        folder: path.join(dir, 'level2', 'level3', 'level4', 'logs'),
        id: '9c1deb4d-57d4-4bad-9bdd-2b0d7b3dcb6d',
        existingId: '9c1deb4d-57d4-4bad-9bdd-1564a4fedc46',
        shouldAlreadyExist: true,
      },
    ],
  ])(
    '%s',
    (
      name,
      {
        folder = dir,
        filename: _filename = 'latest.log',
        id,
        existingId = id,
        shouldAlreadyExist = false,
        shouldDirExist = false,
      } = {}
    ) => {
      const filename = path.join(folder, _filename);

      beforeAll(async () => {
        await fs.remove(dir);
        // Create directory (also create parents)
        if (shouldDirExist || shouldAlreadyExist) {
          if (!(await fs.exists(folder))) {
            await fs.mkdir(folder, { recursive: true });
          }
        }
        // Create file
        if (shouldAlreadyExist) {
          await fs.writeFile(filename, `${existingId}\n`);
        }
      });

      // Testing function call
      test('Expected return', async () => {
        const result = await resolveFile({ folder, filename: _filename, id });
        expect(result).toEqual({
          filename,
          id,
          // Always is new except when the file already existed but with a different id
          isNew: !(shouldAlreadyExist && id === existingId),
        });
      });

      // Check new log file existence
      test('The logfile is created', async () => {
        const exists = await fs.exists(filename);
        expect(exists).toBeTruthy();
      });

      let files;

      test('The expected number of files is created', async () => {
        files = await fs.readdir(folder);

        const count = files.length;
        // The count should be 2 when the file already existed but the id is different, otherwise, must be 1
        expect(count).toBe(shouldAlreadyExist && id !== existingId ? 2 : 1);
      });

      if (shouldAlreadyExist && id !== existingId) {
        // The file is gzipped
        test('The previouse log is gzipped', () => {
          expect(files.filter((file) => file.substring(file.length - 3) === '.gz')).toHaveLength(1);
        });
      }
    }
  );

  afterAll(() => fs.remove(dir));
});
