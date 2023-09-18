/* eslint-disable no-param-reassign */
/**
 * Converts bitrate to a readable format (kbps, Mbps, Gbps, etc.).
 *
 * @param {number} bitrate - The bitrate in bps.
 * @returns {string} The bitrate in a readable format.
 */
function getReadableBitrate(bitrate) {
  if (bitrate < 0) return '-1';

  let i = -1;
  const byteUnits = ['kbps', 'Mbps', 'Gbps', 'Tbps', 'Pbps', 'Ebps', 'Zbps', 'Ybps'];
  do {
    bitrate /= 1000;
    i++;
  } while (bitrate > 1000);

  return `${Math.max(bitrate, 0.1).toFixed(1)} ${byteUnits[i]}`;
}
module.exports = { getReadableBitrate };
