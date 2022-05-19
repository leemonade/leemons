import React from 'react';
import PropTypes from 'prop-types';
import { Box } from '@bubbles-ui/components';

export default function InfoCard(props) {
  const { styles, number, label } = props;

  return (
    <Box className={styles.resumeBox}>
      <Box className={styles.resumeNumber}>{number}</Box>
      <Box className={styles.resumeLabel}>{label}</Box>
    </Box>
  );
}

InfoCard.propTypes = {
  styles: PropTypes.any,
  number: PropTypes.any,
  label: PropTypes.string,
};
