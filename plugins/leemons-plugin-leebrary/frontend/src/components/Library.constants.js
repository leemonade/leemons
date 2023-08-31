import PropTypes from 'prop-types';

export const validateURL = (props, propName, componentName) => {
  let url;
  const errorString = `Invalid prop ${propName} supplied to ${componentName}. Validation failed.`;
  try {
    url = new URL(props.icon);
  } catch (error) {
    return new Error(errorString);
  }
  if (url.protocol !== 'http:' && url.protocol !== 'https:') return new Error(errorString);
};

export const LIBRARYCARD_COVER_DIRECTIONS = ['vertical', 'horizontal'];
export const LIBRARYCARD_ASSIGMENT_ROLES = ['teacher', 'student'];
export const LIBRARY_CARD_DEADLINE_SEVERITY = ['low', 'medium', 'high'];
export const LIBRARY_CARD_DEADLINE_PROP_TYPES = {
  labels: PropTypes.shape({
    title: PropTypes.string,
    new: PropTypes.string,
    deadline: PropTypes.any,
  }),
  icon: PropTypes.oneOfType([
    PropTypes.element,
    (props, propName, componentName) => validateURL(props, propName, componentName),
  ]),
  locale: PropTypes.string,
  deadline: PropTypes.instanceOf(Date),
  direction: PropTypes.oneOf(LIBRARYCARD_COVER_DIRECTIONS),
  parentHovered: PropTypes.bool,
  disableHover: PropTypes.bool,
  role: PropTypes.oneOf(LIBRARYCARD_ASSIGMENT_ROLES),
  severity: PropTypes.oneOf(LIBRARY_CARD_DEADLINE_SEVERITY),
};

export const LIBRARY_CARD_MENU_ITEM = {
  icon: PropTypes.oneOfType([
    PropTypes.element,
    (props, propName, componentName) => validateURL(props, propName, componentName),
  ]),
  label: PropTypes.string,
  rightSection: PropTypes.element,
  disabled: PropTypes.bool,
};
