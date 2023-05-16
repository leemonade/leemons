/* eslint-disable no-nested-ternary */
import { createStyles } from '@bubbles-ui/components';
import PropTypes from 'prop-types';
import React from 'react';
import ConfigPage from '../../pages/private/ConfigPage';

const Styles = createStyles((theme) => ({
  providerButton: {
    height: '70px',
    width: '200px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    backgroundColor: theme.colors.interactive03,
    border: `1px solid ${theme.colors.interactive03}`,
    cursor: 'pointer',
    transition: 'all 0.2s ease-in-out',
    '&:hover': {
      borderColor: theme.colors.interactive01,
    },
    img: {
      height: '16px',
      width: '16px',
      objectFit: 'contain',
      display: 'block',
      marginBottom: theme.spacing[2],
      filter: 'grayscale(100%)',
      transition: 'all 0.2s ease-in-out',
    },
  },
  providerButtonActive: {
    backgroundColor: theme.colors.mainWhite,
    borderColor: theme.colors.interactive01,
    img: {
      filter: 'grayscale(0%)',
    },
  },
}));

const AdminConfig = (props) => <ConfigPage {...props} />;

AdminConfig.defaultProps = {
  onNextLabel: 'Save and continue',
};
AdminConfig.propTypes = {
  onNext: PropTypes.func,
  onNextLabel: PropTypes.string,
};

export { AdminConfig };
export default AdminConfig;
