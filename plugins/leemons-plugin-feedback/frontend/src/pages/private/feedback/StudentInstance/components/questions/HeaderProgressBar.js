import React from 'react';
import PropTypes from 'prop-types';
import { Box, createStyles, Text } from '@bubbles-ui/components';

export const Styles = createStyles((theme) => ({
  questionStep: {
    width: '210px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  questionStepBar: {
    width: '100%',
    height: '8px',
    backgroundColor: theme.colors.uiBackground02,
    borderRadius: 8,
    overflow: 'hidden',
  },
  questionStepBaInner: {
    height: '8px',
    backgroundColor: theme.colors.mainBlack,
  },
  questionStepNumbers: {
    paddingLeft: theme.spacing[3],
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 'none',
  },
}));

function HeaderProgressBar({ max, current }) {
  const { classes } = Styles();
  return (
    <Box className={classes.questionStep}>
      <Box className={classes.questionStepBar}>
        <Box
          className={classes.questionStepBaInner}
          style={{ width: `${((current + 1) / max) * 100}%` }}
        />
      </Box>
      <Box className={classes.questionStepNumbers}>
        <Text size="lg" color="primary">
          {current + 1}
        </Text>
        <Text size="md" color="quartiary">
          /{max}
        </Text>
      </Box>
    </Box>
  );
}

HeaderProgressBar.propTypes = {
  max: PropTypes.number,
  current: PropTypes.number,
};

export default HeaderProgressBar;
