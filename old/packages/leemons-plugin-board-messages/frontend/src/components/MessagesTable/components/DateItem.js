import React from 'react';
import PropTypes from 'prop-types';
import { Box } from '@bubbles-ui/components';
import { useLocale } from '@common';

const DateItem = ({ startDate, endDate }) => {
  const locale = useLocale();
  const isInfinite = new Date(endDate).getFullYear() === new Date('1/1/9999').getFullYear();
  const startDateString = new Date(startDate).toLocaleDateString(locale);
  const endDateString = isInfinite ? '-' : new Date(endDate).toLocaleDateString(locale);
  return (
    <Box style={{ display: 'flex', gap: 26, height: '100%' }}>
      <Box>{startDateString}</Box>
      <Box>{endDateString}</Box>
    </Box>
  );
};

DateItem.propTypes = {
  startDate: PropTypes.string,
  endDate: PropTypes.string,
};

// eslint-disable-next-line import/prefer-default-export
export { DateItem };
