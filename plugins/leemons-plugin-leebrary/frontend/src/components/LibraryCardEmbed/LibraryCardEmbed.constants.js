import PropTypes from 'prop-types';
import { ASSET_PROPS } from '../LibraryCard/LibraryCard.constants';

export const LIBRARY_CARD_EMBED_VARIANTS = ['media', 'bookmark'];

export const LIBRARY_CARD_EMBED_DEFAULT_PROPS = {
  variant: 'media',
  labels: {
    link: '',
  },
};
export const LIBRARY_CARD_EMBED_PROP_TYPES = {
  asset: ASSET_PROPS,
  variant: PropTypes.oneOf(LIBRARY_CARD_EMBED_VARIANTS),
  labels: PropTypes.shape({
    link: PropTypes.string,
  }),
  onDownload: PropTypes.func,
};
