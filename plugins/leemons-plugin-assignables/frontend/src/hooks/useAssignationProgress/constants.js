export const COLORS = (theme) => ({
  primary: theme.colors.text01,
  error: theme.colors.fatic01,
  success: theme.colors.fatic02,
  warning: theme.colors.fatic03,
});

export const STATUS_NAMES = {
  blocked: 'blocked',
  studentNotStarted: 'notStarted',
  studentStarted: 'started',
  evaluableSubmitted: 'submitted',
  nonEvaluableSubmitted: 'ended',
  evaluated: 'evaluated',
  notSubmitted: 'notSubmitted',
};

export const STATUS = {
  [STATUS_NAMES.blocked]: {
    labelKey: 'blocked',
    color: null,
  },

  [STATUS_NAMES.studentNotStarted]: {
    labelKey: 'notStarted',
    color: null,
  },
  [STATUS_NAMES.studentStarted]: {
    labelKey: 'started',
    color: null,
  },

  [STATUS_NAMES.notSubmitted]: {
    labelKey: 'notSubmitted',
    color: 'error',
  },
  [STATUS_NAMES.evaluableSubmitted]: {
    labelKey: 'submitted',
    color: 'success',
  },
  [STATUS_NAMES.nonEvaluableSubmitted]: {
    labelKey: 'ended',
    color: 'success',
  },

  [STATUS_NAMES.evaluated]: {
    labelKey: 'evaluated',
    color: 'success',
  },
};
