import PropTypes from 'prop-types';
import {
  LIBRARY_CARD_DEADLINE_PROP_TYPES,
  LIBRARYCARD_COVER_DIRECTIONS,
  LIBRARY_CARD_MENU_ITEM,
  LIBRARYCARD_ASSIGMENT_ROLES,
} from '../Library.constants';
import { SUBJECT_PROPS } from '../LibraryCard/LibraryCard.constants';

export { LIBRARYCARD_COVER_DIRECTIONS };

export const LIBRARY_CARD_COVER_DEFAULT_PROPS = {
  blur: 5,
  height: 180,
  menuItems: [],
  dashboard: false,
};
export const LIBRARY_CARD_COVER_PROP_TYPES = {
  name: PropTypes.string,
  height: PropTypes.number,
  cover: PropTypes.string,
  color: PropTypes.string,
  blur: PropTypes.number,
  fileIcon: PropTypes.node,
  deadlineProps: PropTypes.shape(LIBRARY_CARD_DEADLINE_PROP_TYPES),
  parentHovered: PropTypes.bool,
  menuItems: PropTypes.arrayOf(PropTypes.shape(LIBRARY_CARD_MENU_ITEM)),
  dashboard: PropTypes.bool,
  subject: SUBJECT_PROPS,
  isNew: PropTypes.bool,
  role: PropTypes.oneOf(LIBRARYCARD_ASSIGMENT_ROLES),
  badge: PropTypes.string,
};
