import PropTypes from 'prop-types';

export const LIBRARY_DETAIL_TOOLBAR_DEFAULT_PROPS = {
  open: true,
};
export const LIBRARY_DETAIL_TOOLBAR_PROP_TYPES = {
  id: PropTypes.string,
  open: PropTypes.bool,
  onEdit: PropTypes.func,
  onDuplicate: PropTypes.func,
  onDownload: PropTypes.func,
  onDelete: PropTypes.func,
  onShare: PropTypes.func,
  onAssign: PropTypes.func,
  onPin: PropTypes.func,
  onUnpin: PropTypes.func,
  onToggle: PropTypes.func,
};
