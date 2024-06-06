import React from 'react';
import PropTypes from 'prop-types';
import { Box, createStyles } from '@bubbles-ui/components';
import ReactPasswordChecklist from 'react-password-checklist';
import { noop } from 'lodash';

export const PASSWORD_POLICIES = {
  MIN_LENGTH: 8,
};

const InvalidIcon = (
  <Box style={{ paddingTop: 2, paddingRight: 6 }}>
    <svg viewBox="0 0 16 16" fill="#B52A2A" aria-hidden="true" width="1em" height="1em">
      <path d="M15.82 13.519 9.534.947a1.714 1.714 0 0 0-3.068 0L.181 13.52A1.714 1.714 0 0 0 1.714 16h12.572a1.714 1.714 0 0 0 1.534-2.481ZM7.143 5.714a.857.857 0 0 1 1.714 0v3.429a.857.857 0 0 1-1.714 0V5.714Zm.857 8a1.143 1.143 0 1 1 0-2.285 1.143 1.143 0 0 1 0 2.285Z"></path>
    </svg>
  </Box>
);

const ValidIcon = (
  <Box style={{ paddingTop: 2, paddingRight: 6 }}>
    <svg width="14" height="12" viewBox="0 0 14 12" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M13.5884 1.64527C13.8452 1.30555 13.79 0.81248 13.465 0.543969C13.1401 0.275458 12.6684 0.333186 12.4116 0.672906L4.56863 9.9215L4.55982 9.93339C4.53102 9.97303 4.49357 10.0049 4.45061 10.0264C4.40764 10.0478 4.3604 10.0582 4.3128 10.0567C4.2652 10.0553 4.21864 10.0419 4.17698 10.0178C4.13531 9.99371 4.09976 9.95956 4.07327 9.9182L4.06312 9.90275L1.61314 6.26786C1.37456 5.91389 0.906657 5.82913 0.568061 6.07855C0.229464 6.32797 0.148389 6.81712 0.386974 7.1711L2.83249 10.7994C2.99126 11.0443 3.20308 11.2466 3.45079 11.3899C3.70147 11.5349 3.98165 11.6152 4.26801 11.6242C4.55437 11.6331 4.83863 11.5704 5.09714 11.4413C5.3532 11.3135 5.57666 11.1241 5.74929 10.8888L13.5884 1.64527Z"
        fill="#44A552"
      />
    </svg>
  </Box>
);

const useStyles = createStyles((theme) => ({
  passwordChecklist: {
    fontSize: 13,
  },
}));

const PasswordChecklist = ({ value, valueAgain, onChange = noop, labels = {} }) => {
  const { classes } = useStyles({}, { name: 'PasswordChecklist' });

  return (
    <ReactPasswordChecklist
      rules={['minLength', 'specialChar', 'number', 'capital']}
      className={classes.passwordChecklist}
      minLength={PASSWORD_POLICIES.MIN_LENGTH}
      value={value}
      valueAgain={valueAgain}
      iconComponents={{
        InvalidIcon,
        ValidIcon,
      }}
      messages={{
        minLength: labels.minLength?.replace('{n}', PASSWORD_POLICIES.MIN_LENGTH),
        specialChar: labels.specialChar,
        number: labels.number,
        capital: labels.capital,
      }}
      onChange={onChange}
    />
  );
};

PasswordChecklist.propTypes = {
  labels: PropTypes.any,
  value: PropTypes.string,
  valueAgain: PropTypes.string,
  onChange: PropTypes.func,
};

export { PasswordChecklist };
