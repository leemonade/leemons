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

function QuestionTitle({ t, question, currentValue }) {
  const { classes } = Styles();
  const subtitle = React.useMemo(() => {
    if (question.type === 'multiResponse') {
      let message =
        question.properties.minResponses === 1
          ? t('needNResponsesSingular')
          : t('needNResponsesPlural', { n: question.properties.minResponses });

      if (currentValue.length) {
        message = null;
        const needMore = question.properties.minResponses - currentValue.length;
        if (needMore) {
          message = t('needNResponses', { n: needMore });
        }
      }

      return message;
    }
    return null;
  }, [question, JSON.stringify(currentValue)]);

  return (
    <Box className={classes.questionStep}>
      <Box className={classes.questionTitleIcon}>
        <ImageLoader className="stroke-current" src={'/public/feedback/question.svg'} />
      </Box>
      <Box className={classes.questionTitleText}>
        <Text size="md" role="productive" color="primary" strong>
          <HtmlText>{question?.question}</HtmlText>
        </Text>
        {subtitle ? (
          <Text size="sm" role="productive">
            {subtitle}
          </Text>
        ) : null}
      </Box>
    </Box>
  );
}

QuestionTitle.propTypes = {
  t: PropTypes.func,
  question: PropTypes.any,
  currentValue: PropTypes.any,
};

export default QuestionTitle;
