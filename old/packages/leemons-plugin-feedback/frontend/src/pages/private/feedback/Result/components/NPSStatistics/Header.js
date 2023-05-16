import React from 'react';
import PropTypes from 'prop-types';
import { Box, Text } from '@bubbles-ui/components';

function Header({ classes, className, cx, title, avg, total, color }) {
  return (
    <Box className={cx(classes.resultSection, className)}>
      <Box>
        <Text color="primary" size="md">
          {title}
        </Text>
      </Box>
      <Box>
        <Text color={color} size="md" strong>
          {Math.trunc(avg)}%
        </Text>
        &nbsp;
        <Text size="md">({total})</Text>
      </Box>
    </Box>
  );
}

Header.propTypes = {
  classes: PropTypes.any,
  cx: PropTypes.any,
  title: PropTypes.string,
  avg: PropTypes.number,
  total: PropTypes.number,
  color: PropTypes.string,
  className: PropTypes.any,
};

export { Header };
