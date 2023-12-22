import PropTypes from 'prop-types';
import { DEFAULT_TOOLBARS } from '../../../TextEditorInput/TextEditorInput.constants';

export const TEXTEDITOR_CONTENT_DEFAULT_PROPS = {
  placeholder: '',
  toolbars: DEFAULT_TOOLBARS,
  toolLabels: {},
  editorLabels: {},
  schemaLabel: '',
  required: false,
  error: '',
  value: '',
  editorStyles: {},
  openSchema: false,
  useSchema: false,
  openLibraryModal: true,
  canExpand: false,
};
export const TEXTEDITOR_CONTENT_PROP_TYPES = {
  placeholder: PropTypes.string,
  required: PropTypes.bool,
  error: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  onChange: PropTypes.func,
  toolLabels: PropTypes.object,
  toolbars: PropTypes.object,
  editorClassname: PropTypes.string,
  openLibraryModal: PropTypes.bool,
  editorLabels: PropTypes.object,
  canExpand: PropTypes.bool,
};
