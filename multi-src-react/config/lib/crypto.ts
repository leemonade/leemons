import crypto from 'crypto';

export function hash(object: Object): string {
  return crypto
    .createHash('sha1')
    .update(JSON.stringify(object))
    .digest('base64')
    .replace(/=/g, '');
}
