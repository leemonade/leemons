import propTypes from 'prop-types';

export const VARIANT_ITEM_DISPLAY_PROP_TYPES = {
  fileType: propTypes.string,
  fileExtension: propTypes.string,
  canAccess: propTypes.array,
  classesCanAccess: propTypes.array,
  action: propTypes.string,
  className: propTypes.string,
  style: propTypes.object,
  variant: propTypes.string,
  variantTitle: propTypes.string,
  variantIcon: propTypes.node,
};

export const VARIANT_ITEM_DISPLAY_DEFAULT_PROPS = {
  fileType: null,
  fileExtension: null,
  canAccess: [],
  classesCanAccess: [],
  action: null,
  className: null,
  style: null,
  variant: null,
  variantTitle: null,
  variantIcon: null,
};
