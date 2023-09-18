const {
  expect,
  it,
  jest: { fn },
} = require('@jest/globals');
const sharp = require('sharp');

const { getOptimizedImage } = require('./getOptimizedImage');

jest.mock('sharp');
jest.mock('lodash');

it('should call sharp with the correct path when path is not empty', () => {
  const path = 'testPath';
  const extension = 'jpeg';

  sharp.mockReturnValue({
    resize: jest.fn().mockReturnThis(),
    toFormat: jest.fn().mockReturnThis(),
  });

  getOptimizedImage({ path, extension });

  expect(sharp).toHaveBeenCalledWith(path);
});

it('should call sharp with no arguments when path is empty', () => {
  const path = '';
  const extension = 'jpeg';

  sharp.mockReturnValue({
    resize: fn().mockReturnThis(),
    toFormat: fn().mockReturnThis(),
  });

  getOptimizedImage({ path, extension });

  expect(sharp).toHaveBeenCalledWith();
});

it('should call resize and toFormat with the correct arguments', () => {
  const path = 'testPath';
  const extension = 'jpeg';
  const resizeMock = fn().mockReturnThis();
  const toFormatMock = fn().mockReturnValue('Expected Value');

  sharp.mockReturnValue({
    resize: resizeMock,
    toFormat: toFormatMock,
  });

  const response = getOptimizedImage({ path, extension });

  expect(resizeMock).toHaveBeenCalledWith(1024, 1024, { fit: 'inside', withoutEnlargement: true });
  expect(toFormatMock).toHaveBeenCalledWith(extension, { quality: 70 });
  expect(response).toBe('Expected Value');
});
