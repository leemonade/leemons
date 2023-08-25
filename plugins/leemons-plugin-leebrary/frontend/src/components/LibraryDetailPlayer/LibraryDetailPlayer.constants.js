import PropTypes from 'prop-types';
import { LIBRARY_DETAIL_VARIANTS } from '../LibraryDetail/LibraryDetail.constants';

export const LIBRARY_DETAIL_PLAYER_DEFAULT_PROPS = {
  height: 202,
};
export const LIBRARY_DETAIL_PLAYER_PROP_TYPES = {
  name: PropTypes.string,
  height: PropTypes.number,
  cover: PropTypes.string,
  url: PropTypes.string,
  color: PropTypes.string,
  variant: PropTypes.oneOf(LIBRARY_DETAIL_VARIANTS),
  fileIcon: PropTypes.element,
  fileType: PropTypes.string,
  metadata: PropTypes.any,
};
