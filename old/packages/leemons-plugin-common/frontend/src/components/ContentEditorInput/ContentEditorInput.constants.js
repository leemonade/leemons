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
  placeholder: PropTypes.string,
  required: PropTypes.bool,
  error: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  onChange: PropTypes.func,
  children: PropTypes.element,
  toolLabels: PropTypes.shape({
    format: PropTypes.string,
    schema: PropTypes.string,
    headingsTool: PropTypes.shape({
      label: PropTypes.string,
      title1: PropTypes.string,
      title2: PropTypes.string,
      title3: PropTypes.string,
      paragraph: PropTypes.string,
    }),
    colorTool: PropTypes.string,
    transformsTool: PropTypes.shape({
      bold: PropTypes.string,
      italic: PropTypes.string,
      underline: PropTypes.string,
      strike: PropTypes.string,
    }),
    textAlignTool: PropTypes.shape({
      left: PropTypes.string,
      center: PropTypes.string,
      justify: PropTypes.string,
      right: PropTypes.string,
    }),
    listIndentTool: PropTypes.shape({
      unordered: PropTypes.string,
      ordered: PropTypes.string,
      indent: PropTypes.string,
      outdent: PropTypes.string,
    }),
    scriptsTool: PropTypes.shape({
      superscript: PropTypes.string,
      subscript: PropTypes.string,
    }),
    linkTool: PropTypes.shape({
      labels: PropTypes.shape({
        label: PropTypes.string,
        text: PropTypes.string,
        link: PropTypes.string,
        cancel: PropTypes.string,
        add: PropTypes.string,
        update: PropTypes.string,
      }),
      placeholders: PropTypes.shape({
        text: PropTypes.string,
        link: PropTypes.string,
        label: PropTypes.string,
      }),
      errorMessages: PropTypes.shape({
        text: PropTypes.string,
        link: PropTypes.string,
        validURL: PropTypes.string,
      }),
    }),
    libraryTool: PropTypes.shape({
      labels: PropTypes.shape({
        width: PropTypes.string,
        display: PropTypes.string,
        align: PropTypes.string,
        cancel: PropTypes.string,
        add: PropTypes.string,
        update: PropTypes.string,
      }),
      placeholders: PropTypes.shape({
        width: PropTypes.string,
        display: PropTypes.string,
      }),
      errorMessages: PropTypes.shape({
        width: PropTypes.string,
        display: PropTypes.string,
      }),
      bubbleMenu: PropTypes.shape({
        remove: PropTypes.string,
        library: PropTypes.string,
        twoColumns: PropTypes.string,
        fullWidth: PropTypes.string,
      }),
    }),
  }),
  toolbars: PropTypes.shape({
    heading: PropTypes.bool,
    color: PropTypes.bool,
    style: PropTypes.bool,
    align: PropTypes.bool,
    list: PropTypes.bool,
    formulation: PropTypes.bool,
  }),
  editorStyles: PropTypes.object,
  editorClassname: PropTypes.string,
  openSchema: PropTypes.bool,
  useSchema: PropTypes.bool,
  openLibraryModal: PropTypes.bool,
};
