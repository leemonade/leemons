import {
  Box,
  Button,
  createStyles,
  ProgressBottomBar,
  TotalLayoutFooterContainer,
  TotalLayoutStepContainer,
} from '@bubbles-ui/components';
import { ChevronLeftIcon, ChevronRightIcon } from '@bubbles-ui/icons/outline';
import { useStore } from '@common';
import prefixPN from '@feedback/helpers/prefixPN';
import QuestionTitle from '@feedback/pages/private/feedback/StudentInstance/components/questions/QuestionTitle';
import SelectResponseQuestion from '@feedback/pages/private/feedback/StudentInstance/components/questions/SelectResponseQuestion';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import PropTypes from 'prop-types';
import React from 'react';

import { setInstanceTimestamp } from '@feedback/request/feedback';
import LikertResponse from './LikertResponse';
import NetPromoterScoreResponse from './NetPromoterScoreResponse';
import OpenResponse from './OpenResponse';

export const Styles = createStyles((theme, { viewMode }) => ({
  container: {
    maxWidth: viewMode ? '100%' : 768,
    width: '100%',
    margin: '0px auto',
    marginTop: 45,
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

const questionsByType = {
  singleResponse: <SelectResponseQuestion />,
  multiResponse: <SelectResponseQuestion multi />,
  likertScale: <LikertResponse />,
  netPromoterScore: <NetPromoterScoreResponse />,
  openResponse: <OpenResponse />,
};

function QuestionsCard({
  viewMode,
  feedback,
  instanceId,
  defaultValues,
  userId,
  scrollRef,
  setShowIntroduction,
}) {
  const { classes } = Styles({ viewMode });
  const [t, translations] = useTranslateLoader(prefixPN('feedbackResponseQuestion'));
  const [store, render] = useStore({
    maxIndex: 0,
    currentIndex: 0,
    values: defaultValues || {},
  });

  const question = feedback?.questions[store.currentIndex];

  const isLast = React.useMemo(
    () => feedback.questions.length - 1 === store.currentIndex,
    [feedback, store.currentIndex]
  );

  async function onNext(value) {
    store.values[question.id] = value;

    if (!isLast) {
      store.currentIndex++;
      if (store.currentIndex > store.maxIndex) {
        store.maxIndex = store.currentIndex;
      }
    } else if (!viewMode) setInstanceTimestamp(instanceId, 'end', userId);

    render();
  }

  function onPrev() {
    if (store.currentIndex === 0) {
      setShowIntroduction(true);
    } else {
      store.currentIndex--;
    }
    render();
  }
  if (!translations) return null;
  return (
    <TotalLayoutStepContainer
      Footer={
        <TotalLayoutFooterContainer
          scrollRef={scrollRef}
          rightZone={
            <Box sx={{ minWidth: '120px' }}>
              {!isLast && (
                <Button variant="outline" rightIcon={<ChevronRightIcon />} onClick={onNext}>
                  {t('next')}
                </Button>
              )}
            </Box>
          }
          leftZone={
            <Button variant="outline" leftIcon={<ChevronLeftIcon />} onClick={onPrev}>
              {t('back')}
            </Button>
          }
        >
          <Box sx={() => ({ display: 'flex', justifyContent: 'center', marginLeft: '24px' })}>
            <Box sx={() => ({ maxWidth: '280px', width: '100%' })}>
              <ProgressBottomBar
                size="md"
                labelTop={`${store.currentIndex + 1} / ${feedback.questions.length}`}
                value={((store.currentIndex + 1) / feedback.questions.length) * 100}
              />
            </Box>
          </Box>
        </TotalLayoutFooterContainer>
      }
    >
      {question ? (
        <Box className={classes.questionCard}>
          <QuestionTitle viewMode={viewMode} question={question} />
          <Box className={classes.questionContainer}>
            {React.cloneElement(questionsByType[question.type], {
              question,
              feedback,
              currentIndex: store.currentIndex,
              onNext,
              onPrev,
              viewMode,
              defaultValue: store.values[question.id],
              setCurrentValue: (e) => {
                store.currentValue = e;
                render();
              },
              t,
            })}
          </Box>
        </Box>
      ) : null}
    </TotalLayoutStepContainer>
  );
}

QuestionsCard.propTypes = {
  feedback: PropTypes.any,
  instance: PropTypes.any,
  instanceId: PropTypes.string,
  defaultValues: PropTypes.any,
  userId: PropTypes.string,
  viewMode: PropTypes.bool,
  returnToTable: PropTypes.func,
  modalMode: PropTypes.number,
  nextActivityUrl: PropTypes.any,
  scrollRef: PropTypes.any,
  setShowIntroduction: PropTypes.func,
};

export default QuestionsCard;
