import PropTypes from 'prop-types';
import { ASSET_PROPS } from '../LibraryCard/LibraryCard.constants';

export function getSize(size) {
  const sizes = {
    sm: {
      height: 40,
      width: 40,
    },
    md: {
      height: 60,
      width: 60,
    },
    lg: {
      height: 80,
      width: 80,
    },
  };
  return sizes[size];
}

export const LIBRARY_ITEM_SIZES = ['sm', 'md', 'lg'];

export const LIBRARY_ITEM_DEFAULT_PROPS = {
  size: 'sm',
};
export const LIBRARY_ITEM_PROP_TYPES = {
  asset: ASSET_PROPS,
  size: PropTypes.oneOf(LIBRARY_ITEM_SIZES),
  label: PropTypes.string,
};
