import PropTypes from 'prop-types';

export const DEFAULT_TOOLBARS = {
  style: true,
  align: true,
  list: true,
  history: true,
  heading: true,
  color: true,
  formulation: false,
  link: true,
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
};
export const TEXT_EDITOR_INPUT_PROP_TYPES = {
  placeholder: PropTypes.string,
  label: PropTypes.string,
  description: PropTypes.string,
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
