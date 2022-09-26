import React from 'react';
import PropTypes from 'prop-types';
import { Box, createStyles, HtmlText, ImageLoader, Text } from '@bubbles-ui/components';

export const Styles = createStyles((theme) => ({
  questionStep: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: theme.spacing[4],
    paddingBottom: theme.spacing[4],
    paddingLeft: theme.spacing[5],
    paddingRight: theme.spacing[5],
  },
  questionTitleIcon: {
    display: 'inline-block',
    position: 'relative',
    height: '23px',
    width: '23px',
    marginRight: theme.spacing[3],
    color: theme.colors.text05,
  },
  questionTitleText: {
    width: 'calc(100% - 23px )',
  },
}));

function QuestionTitle({ question }) {
  const { classes } = Styles();
  return (
    <Box className={classes.questionStep}>
      <Box className={classes.questionTitleIcon}>
        <ImageLoader className="stroke-current" src={'/public/feedback/question.svg'} />
      </Box>
      <Box className={classes.questionTitleText}>
        <Text size="md" role="productive" color="primary" strong>
          <HtmlText>{question?.question}</HtmlText>
        </Text>
      </Box>
    </Box>
  );
}

QuestionTitle.propTypes = {
  question: PropTypes.any,
};

export default QuestionTitle;
