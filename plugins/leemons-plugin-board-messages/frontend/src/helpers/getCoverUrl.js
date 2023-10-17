import { getFileUrl } from '@leebrary/helpers/prepareAsset';
import isString from 'lodash/isString';
import isValidURL from './isValidURL';

export default function getCoverUrl(cover) {
  if (cover?.id) {
    return getFileUrl(cover.id);
  }

  if (cover instanceof File) {
    return URL.createObjectURL(cover);
  }

  if (isString(cover) && isValidURL(cover)) {
    return cover;
  }

  return null;
}
