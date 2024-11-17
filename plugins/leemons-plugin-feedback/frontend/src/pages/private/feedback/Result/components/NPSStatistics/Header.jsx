import React from 'react';
import PropTypes from 'prop-types';
import { Box, Text } from '@bubbles-ui/components';

function Header({ classes, className, cx, title, avg, total, color }) {
  return (
    <Box className={cx(classes.resultSection, className)}>
      <Box>
        <Text
          sx={(theme) => ({
            ...theme.other.global.content.typo.heading['xsm--semiBold'],
            fontSize: '12px',
            lineHeight: '16px',
          })}
        >
          {title}
        </Text>
      </Box>
      <Box>
        <Text
          sx={(theme) => ({
            ...theme.other.global.content.typo.heading['xsm--semiBold'],
            fontSize: '12px',
            lineHeight: '16px',
          })}
        >
          {Math.trunc(avg)}%
        </Text>
        &nbsp;
        <Text
          sx={(theme) => ({
            ...theme.other.global.content.typo.heading['xsm--semiBold'],
            fontSize: '12px',
            lineHeight: '16px',
          })}
        >
          ({total})
        </Text>
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
