/* eslint-disable no-param-reassign */
const { LeemonsError } = require('@leemons/error');
const { default: mediainfoAlias } = require('mediainfo.js');
const { getReadableDuration } = require('./getReadableDuration');
const { getReadableBitrate } = require('./getReadableBitrate');
const { getMetaProps } = require('./getMetaProps');

// This mediainfo variable is set globally because we want to instanciate it
// and not create a new instance everytime the "analyzeFile" function is called
let mediainfo;

/**
 * Analyzes the file and extracts metadata if it's an image, audio, or video file.
 *
 * @param {Object} params - The params object
 * @param {Object} [params.metadata] - The metadata of the file.
 * @param {Object} params.fileHandle - The file handle.
 * @param {string} params.fileType - The type of the file.
 * @param {number} params.fileSize - The size of the file.
 * @param {MoleculerContext} params.ctx - The moleculer context.
 * @returns {Promise<Object>} The metadata of the file.
 */

// eslint-disable-next-line sonarjs/cognitive-complexity
async function handleMediaInfo({ metadata = {}, fileHandle, fileType, fileSize, ctx }) {
  if (['image', 'audio', 'video'].includes(fileType)) {
    const readChunk = async (size, offset) => {
      const buffer = Buffer.alloc(size);
      await fileHandle.read(buffer, 0, size, offset);
      return buffer;
    };

    try {
      if (!fileSize) throw new LeemonsError(ctx, { message: 'No file size' });
      if (!mediainfo) {
        // mediainfo = await global.utils.mediaInfo({ format: 'JSON' });
        // eslint-disable-next-line global-require
        mediainfo = await mediainfoAlias({ format: 'JSON' });
      }

      const metainfo = await mediainfo.analyzeData(() => fileSize, readChunk);
      const { track: tracks } = JSON.parse(metainfo)?.media || { track: [] };
      tracks.forEach((track) => {
        metadata = getMetaProps({ data: track, result: metadata });
      });

      if (metadata.bitrate) {
        metadata.bitrate = getReadableBitrate(Number(metadata.bitrate));
      }

      if (metadata.duration) {
        metadata.duration = getReadableDuration({ duration: Number(metadata.duration) * 1000 });
      }
    } catch (err) {
      ctx.logger.error('-- ERROR: obtaining metadata --');
      ctx.logger.info(err);
    }

    if (fileHandle) await fileHandle.close();
    if (mediainfo) await mediainfo.close();
  }

  return metadata;
}

module.exports = { handleMediaInfo };
