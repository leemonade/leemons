import PropTypes from 'prop-types';

export const DEFAULT_TOOLBARS = {
  style: true,
  heading: true,
  align: true,
  list: true,
  history: true,
  color: true,
  formulation: false,
  link: true,
  library: true,
};

export const TEXT_EDITOR_INPUT_DEFAULT_PROPS = {
  placeholder: '',
  toolbars: DEFAULT_TOOLBARS,
  label: '',
  description: '',
  help: '',
  required: false,
  error: '',
  editorStyles: {},
  toolLabels: {},
};
export const TEXT_EDITOR_INPUT_PROP_TYPES = {
  placeholder: PropTypes.string,
  label: PropTypes.string,
  description: PropTypes.string,
  toolLabels: PropTypes.shape({
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
  help: PropTypes.string,
  required: PropTypes.bool,
  error: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  onChange: PropTypes.func,
  children: PropTypes.element,
  toolbars: PropTypes.shape({
    color: PropTypes.bool,
    style: PropTypes.bool,
    heading: PropTypes.bool,
    align: PropTypes.bool,
    list: PropTypes.bool,
    formulation: PropTypes.bool,
  }),
  editorStyles: PropTypes.object,
  editorClassname: PropTypes.string,
};
