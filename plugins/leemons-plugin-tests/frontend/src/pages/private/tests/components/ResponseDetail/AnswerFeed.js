import React from 'react';

import { Stack, createStyles, Text, Box } from '@bubbles-ui/components';
import PropTypes from 'prop-types';

import ResponseStatusIcon from './ResponseStatusIcon';

const useAnswerFeedStyles = createStyles((theme, { isCorrect }) => {
  return {
    container: {
      backgroundColor: isCorrect
        ? theme.other.core.color.success['100']
        : theme.other.core.color.danger['100'],
      gap: 8,
      padding: 8,
    },
  };
});
function AnswerFeed({ isCorrect, t }) {
  const { classes } = useAnswerFeedStyles({ isCorrect });

  const label = isCorrect ? 'correct' : 'incorrect';

  return (
    <Stack className={classes.container} fullWidth alignItems="center">
      <ResponseStatusIcon isCorrect={isCorrect} />
      <Box>
        <Text>{t(label)}</Text>
      </Box>
    </Stack>
  );
}

AnswerFeed.propTypes = {
  t: PropTypes.func,
  isCorrect: PropTypes.bool,
};

export default AnswerFeed;
