import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Box, createStyles, Title } from '@bubbles-ui/components';

export const Styles = createStyles((theme) => ({
  questionStep: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: theme.spacing[4],
    paddingBottom: theme.spacing[4],
    paddingRight: theme.spacing[5],
    backgroundColor: 'transparent',
  },
  questionTitleText: {
    width: '100%',
    display: 'flex',
    justifyContent: 'start',
    flexDirection: 'column',
    gap: theme.spacing[3],
  },
}));

function QuestionTitle({ viewMode, question }) {
  const { classes } = Styles({ viewMode });
  const questionName = useMemo(() => {
    const plainText = question?.question
      ? new DOMParser().parseFromString(question.question, 'text/html').body.textContent
      : '';
    return `${question.order + 1}. ${plainText}`;
  }, [question]);

  return (
    <Box className={classes.questionStep}>
      <Box className={classes.questionTitleText}>
        <Title order={3}>{questionName}</Title>
      </Box>
    </Box>
  );
}

QuestionTitle.propTypes = {
  viewMode: PropTypes.bool,
  question: PropTypes.object,
};

export default QuestionTitle;
