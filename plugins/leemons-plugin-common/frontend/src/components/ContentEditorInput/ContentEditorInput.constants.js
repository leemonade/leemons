import PropTypes from 'prop-types';
import { DEFAULT_TOOLBARS } from '../TextEditorInput/TextEditorInput.constants';

export const CONTENT_EDITOR_INPUT_DEFAULT_PROPS = {
  placeholder: '',
  toolbars: DEFAULT_TOOLBARS,
  toolLabels: {},
  schemaLabel: '',
  required: false,
  error: '',
  editorStyles: {},
  openSchema: false,
  useSchema: false,
  openLibraryModal: true,
};
export const CONTENT_EDITOR_INPUT_PROP_TYPES = {
  children: PropTypes.element,
  schemaLabel: PropTypes.string,
  openSchema: PropTypes.bool,
  useSchema: PropTypes.bool,
  editorStyles: PropTypes.object,
};
