/**
 * Formats a file size in bytes to a human readable string
 * @param {number} bytes - The size in bytes
 * @param {boolean} useBinaryBase - Use 1024 instead of 1000 as base
 * @returns {string} - Formatted size with units
 */
function formatFileSize(bytes, useBinaryBase = false) {
  if (!bytes) return '0 B';

  const base = useBinaryBase ? 1024 : 1000;
  const units = useBinaryBase ? ['B', 'KiB', 'MiB', 'GiB', 'TiB'] : ['B', 'KB', 'MB', 'GB', 'TB'];

  const exponent = Math.floor(Math.log(bytes) / Math.log(base));
  const unit = units[Math.min(exponent, units.length - 1)];
  const size = bytes / Math.pow(base, exponent);

  const roundedSize = Math.round(size * 10) / 10;

  return `${roundedSize} ${unit}`;
}

export default formatFileSize;
