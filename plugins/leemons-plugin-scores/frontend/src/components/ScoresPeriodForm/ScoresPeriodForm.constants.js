import PropTypes from 'prop-types';

export const SCORES_PERIOD_FORM_DEFAULT_PROPS = {
  labels: {
    startDate: '',
    endDate: '',
    submit: '',
    newPeriod: '',
    addPeriod: '',
    shareWithTeachers: '',
    saveButton: '',
  },
  errorMessages: {
    startDate: '',
    endDate: '',
    validateStartDate: '',
    validateEndDate: '',
  },
  fields: [],
  allowCreate: false,
  periods: [],
  locale: 'en-US',
};
export const SCORES_PERIOD_FORM_PROP_TYPES = {
  value: PropTypes.shape({
    program: PropTypes.any,
    course: PropTypes.any,
    subject: PropTypes.any,
    startDate: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
    endDate: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
  }),
  fields: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      placeholder: PropTypes.string,
      data: PropTypes.arrayOf(PropTypes.string),
      required: PropTypes.string,
    })
  ),
  labels: PropTypes.shape({
    startDate: PropTypes.string,
    endDate: PropTypes.string,
    submit: PropTypes.string,
    newPeriod: PropTypes.string,
    addPeriod: PropTypes.string,
    shareWithTeachers: PropTypes.string,
    saveButton: PropTypes.string,
  }),
  errorMessages: PropTypes.shape({
    startDate: PropTypes.string,
    endDate: PropTypes.string,
    validateStartDate: PropTypes.string,
    validateEndDate: PropTypes.string,
  }),
  onSubmit: PropTypes.func,
  onSave: PropTypes.func,
  onChange: PropTypes.func,
  allowCreate: PropTypes.bool,
  periods: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      startDate: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
      endDate: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
      name: PropTypes.string,
    })
  ),
  locale: PropTypes.string,
};

export const PERIODS_PROP_TYPES = {
  periods: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      startDate: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
      endDate: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
      name: PropTypes.string,
    })
  ),
};

export const SELECT_DATES_PROP_TYPES = {
  classes: PropTypes.object,
  control: PropTypes.object,
  errorMessages: PropTypes.object,
  errors: PropTypes.object,
  labels: PropTypes.object,
  locale: PropTypes.string,
  watch: PropTypes.func,
  getValues: PropTypes.func,
  required: PropTypes.bool,
};

export const PERIODCREATIONFORM_PROP_TYPES = {
  classes: PropTypes.object,
  control: PropTypes.object,
  errorMessages: PropTypes.object,
  labels: PropTypes.object,
  errors: PropTypes.object,
  handleSubmit: PropTypes.func,
  onSaveHandler: PropTypes.func,
};
