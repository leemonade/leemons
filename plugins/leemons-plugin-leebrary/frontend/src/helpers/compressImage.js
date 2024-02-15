import { readAndCompressImage } from 'browser-image-resizer';

const DEFAULT_RESIZING_CONFIG = {
  quality: 0.8,
  maxWidth: 800,
  maxHeight: 600,
  debug: true,
};
const MAX_SIZE_ALLOWED = 50000; // bytes

/**
 * Compresses an image file if it exceeds a maximum size limit.
 *
 * @async
 * @function compressImage
 * @param {Object} params - The function parameters.
 * @param {File} params.file - The image file to be compressed.
 * @param {Object} [params.config=DEFAULT_RESIZING_CONFIG] - The configuration for image compression.
 * @returns {Promise<File|null>} A promise that resolves with the compressed image file or null if the input is invalid.
 */
async function compressImage({ file, config = DEFAULT_RESIZING_CONFIG }) {
  if (!file || !(file instanceof File)) return null;
  if (file.size <= MAX_SIZE_ALLOWED) return file;

  const compressedImageBlob = await readAndCompressImage(file, config);
  return new File([compressedImageBlob], file.name, {
    type: file.type,
  });
}

export default compressImage;
export { compressImage };
