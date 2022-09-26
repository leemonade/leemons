import React from 'react';
import PropTypes from 'prop-types';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import prefixPN from '@feedback/helpers/prefixPN';
import HeaderProgressBar from '@feedback/pages/private/feedback/StudentInstance/components/questions/HeaderProgressBar';

import { Box, createStyles, Text } from '@bubbles-ui/components';
import { useStore } from '@common';
import QuestionTitle from '@feedback/pages/private/feedback/StudentInstance/components/questions/QuestionTitle';
import QuestionButtons from '@feedback/pages/private/feedback/StudentInstance/components/questions/QuestionButtons';
import OpenResponse from './OpenResponse';

export const Styles = createStyles((theme) => ({
  container: {
    maxWidth: 768,
    width: '100%',
    margin: '0px auto',
  },
  header: {
    height: 56,
    borderRadius: 4,
    backgroundColor: theme.colors.uiBackground01,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: theme.spacing[5],
    paddingRight: theme.spacing[5],
    marginBottom: theme.spacing[2],
  },
  questionCard: {
    borderRadius: 4,
    backgroundColor: theme.colors.uiBackground01,
  },
  questionContainer: {
    padding: theme.spacing[5],
  },
}));

function Empty(props) {
  const { question } = props;

  return (
    <Box>
      Gatitos <QuestionButtons {...props} />
    </Box>
  );
}

const questionsByType = {
  singleResponse: <Empty />,
  multiResponse: <Empty multi />,
  likertScale: <Empty />,
  netPromoterScore: <Empty />,
  openResponse: <OpenResponse />,
};

function QuestionsCard({ feedback }) {
  const { classes } = Styles();
  const [t, translations] = useTranslateLoader(prefixPN('feedbackResponseQuestion'));
  const [store, render] = useStore({
    maxIndex: 0,
    currentIndex: 0,
  });
  const question = feedback.questions[store.currentIndex];

  function onNext() {
    store.currentIndex++;
    if (store.currentIndex > store.maxIndex) {
      store.maxIndex = store.currentIndex;
    }
    render();
  }

  function onPrev() {
    store.currentIndex--;
    render();
  }

  if (!translations) return null;

  return (
    <Box className={classes.container}>
      <Box className={classes.header}>
        <Box className={classes.headerText}>
          <Text size="sm" stronger>
            {t('nQuestion', { n: store.currentIndex + 1 })}
          </Text>
          &nbsp;
          {question.required ? <Text role="productive">{t('questionRequired')}</Text> : null}
        </Box>
        <HeaderProgressBar current={store.maxIndex} max={feedback.questions.length} />
      </Box>
      {question ? (
        <Box className={classes.questionCard}>
          <QuestionTitle question={question} />
          <Box className={classes.questionContainer}>
            {React.cloneElement(questionsByType[question.type], {
              question,
              feedback,
              currentIndex: store.currentIndex,
              onNext,
              onPrev,
              t,
            })}
          </Box>
        </Box>
      ) : null}
    </Box>
  );
}

QuestionsCard.propTypes = {
  feedback: PropTypes.any,
};

export default QuestionsCard;
