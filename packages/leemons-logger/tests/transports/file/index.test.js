const path = require('path');
const winston = require('winston');
const fs = require('fs-extra');
const chalk = require('chalk');
const _ = require('lodash');
const {
  format: { timestamp },
} = require('winston');

const File = require('../../../lib/transports/file');

describe('File transport', () => {
  const dir = path.join(__dirname, 'testOutput');
  afterAll(() => fs.remove(dir));
  describe.each([
    [
      'Error level',
      {
        level: 'error',
        message: 'Error message',
      },
    ],
    [
      'Warn level',
      {
        level: 'warn',
        message: 'Warn message',
      },
    ],
    [
      'HTTP level',
      {
        level: 'http',
        message: 'HTTP message',
      },
    ],
    [
      'Verbose level',
      {
        level: 'verbose',
        message: 'Verbose message',
      },
    ],
    [
      'Debug level',
      {
        level: 'debug',
        message: 'Debug message',
      },
    ],
    [
      'Silly level',
      {
        level: 'silly',
        message: 'Silly message',
      },
    ],
    [
      'Error level with metadata',
      {
        level: 'error',
        message: 'Error message',
        metadata: { infoObj: [1, 2, 3] },
      },
    ],
    [
      'Warn level with metadata',
      {
        level: 'warn',
        message: 'Warn message',
        metadata: { other: { object: true } },
      },
    ],
    [
      'HTTP level with metadata and labels',
      {
        level: 'http',
        message: 'HTTP message',
        metadata: { test: 'hi', labels: { service: 'service1', pid: 7198 } },
      },
    ],
    [
      'Verbose level with metadata',
      {
        level: 'verbose',
        message: 'Verbose message',
        metadata: { tst1: 'hi' },
      },
    ],
    [
      'Debug level with metadata and labels',
      {
        level: 'debug',
        message: 'Debug message',
        metadata: { tst2: 'hi', labels: { process: 'service1', PID: 7198 } },
      },
    ],
    [
      'Silly level with metadata',
      {
        level: 'silly',
        message: 'Silly message',
        metadata: { tst3: 'hi' },
      },
    ],
    [
      'Colorized output to uncolorized output',
      {
        level: 'silly',
        message: chalk`{red Red message}`,
        expectedMessage: 'Red message',
        filename: 'AWorldWithoutColors.log',
      },
    ],
  ])(
    '%s',
    (
      name,
      {
        folder = dir,
        level,
        message,
        expectedMessage = message,
        filename = 'latest.log',
        metadata = {},
      }
    ) => {
      let fileContent;
      beforeAll(async (next) => {
        await fs.remove(dir);
        const fileTransport = await File({
          id: '9c1deb4d-57d4-4bad-9bdd-2b0d7b3dcb6d',
          folder,
          filename,
        });

        const logger = winston.createLogger({ transports: [fileTransport] });
        logger.level = 'silly';

        logger[level](message, { ...metadata });

        // When the logger finished logging
        logger.on('finish', () => {
          // Wait to the file to get written
          let _filecontent = '';
          setTimeout(async () => {
            fs.createReadStream(path.join(folder, filename))
              // Save the data
              .on('data', (data) => {
                _filecontent += data;
              })
              // Detect file ending
              .on('end', () => {
                fileContent = _filecontent.substring(37);
                next();
              });
          }, 100);
        });
        logger.end();
      }, 30000);

      test('File is not empty', () => {
        expect(fileContent).not.toBe('');
      });

      test('Log is saved as json', () => {
        expect(() => JSON.parse(fileContent)).not.toThrow();
      });

      test('Has info level', () => {
        const jsonContent = JSON.parse(fileContent);
        expect(jsonContent.level).toBe(level.toUpperCase());
      });

      test('Has message', () => {
        const jsonContent = JSON.parse(fileContent);
        expect(jsonContent.message).toBe(expectedMessage);
      });

      test('Has timestamp', () => {
        const jsonContent = JSON.parse(fileContent);
        expect(jsonContent).toHaveProperty('timestamp');
      });

      test('Has metadata', () => {
        const jsonContent = JSON.parse(fileContent);
        expect(jsonContent.metadata).toEqual(_.omit(metadata, ['labels']));
      });

      test('Has labels', () => {
        const jsonContent = JSON.parse(fileContent);
        if (_.has(metadata, 'labels')) {
          expect(jsonContent.labels).toEqual(metadata.labels);
        } else {
          expect(jsonContent).not.toHaveProperty('labels');
        }
      });
    }
  );

  describe('Custom format', () => {
    const folder = dir;
    const level = 'info';
    const message = 'Custom format';
    const expectedMessage = message;
    const filename = 'latest.log';
    const format = timestamp;

    let fileContent;
    beforeAll(async (next) => {
      await fs.remove(dir);
      const fileTransport = await File({
        id: '9c1deb4d-57d4-4bad-9bdd-2b0d7b3dcb6d',
        folder,
        filename,
        format,
      });

      const logger = winston.createLogger({ transports: [fileTransport] });
      logger.level = 'silly';

      logger[level](message);

      // When the logger finished logging
      logger.on('finish', () => {
        // Wait to the file to get written
        let _filecontent = '';
        setTimeout(async () => {
          fs.createReadStream(path.join(folder, filename))
            // Save the data
            .on('data', (data) => {
              _filecontent += data;
            })
            // Detect file ending
            .on('end', () => {
              fileContent = _filecontent.substring(37);
              next();
            });
        }, 100);
      });
      logger.end();
    }, 30000);

    test('File is not empty', () => {
      expect(fileContent).not.toBe('');
    });

    test('Log is saved as json', () => {
      expect(() => JSON.parse(fileContent)).not.toThrow();
    });

    test('Has info level', () => {
      const jsonContent = JSON.parse(fileContent);
      // Is not uppercased, 'cause we removed the levelUppercase format
      expect(jsonContent.level).toBe(level);
    });

    test('Has message', () => {
      const jsonContent = JSON.parse(fileContent);
      expect(jsonContent.message).toBe(expectedMessage);
    });

    test('Has timestamp', () => {
      const jsonContent = JSON.parse(fileContent);
      expect(jsonContent).toHaveProperty('timestamp');
    });
  });
});
