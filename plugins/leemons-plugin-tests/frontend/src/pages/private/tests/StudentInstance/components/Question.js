import { useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';

import {
  Box,
  Button,
  ProgressBottomBar,
  TotalLayoutFooterContainer,
  TotalLayoutStepContainer,
  Stack,
} from '@bubbles-ui/components';
import { ChevLeftIcon, ChevRightIcon } from '@bubbles-ui/icons/outline';
import { forEach, isNumber } from 'lodash';
import PropTypes from 'prop-types';

import QuestionValue from './QuestionValue';
import Map from './questions/Map';
import MonoResponse from './questions/MonoResponse';
import OpenResponse from './questions/OpenResponse';
import ShortResponse from './questions/ShortResponse';
import TrueFalse from './questions/TrueFalse';

import { QUESTION_TYPES } from '@tests/pages/private/questions-banks/questionConstants';

// HELPER FUNCTIONS ········································································|
const getMonoResponseNextLabel = (currentResponse, t) => {
  return isNumber(currentResponse) ? t('nextButton') : t('skipButton');
};

const getShortAndOpenResponseNextLabel = (currentResponse, t) => {
  return currentResponse ? t('nextButton') : t('skipButton');
};

const getTrueFalseNextLabel = (currentResponse, t) => {
  return typeof currentResponse === 'boolean' ? t('nextButton') : t('skipButton');
};

const getMapNextLabel = (_, t, allSelectsUsed) => {
  return allSelectsUsed ? t('nextButton') : t('skipButton');
};

const getNextLabelByQuestionType = {
  [QUESTION_TYPES.MONO_RESPONSE]: getMonoResponseNextLabel,
  [QUESTION_TYPES.SHORT_RESPONSE]: getShortAndOpenResponseNextLabel,
  [QUESTION_TYPES.TRUE_FALSE]: getTrueFalseNextLabel,
  [QUESTION_TYPES.MAP]: getMapNextLabel,
  [QUESTION_TYPES.OPEN_RESPONSE]: getShortAndOpenResponseNextLabel,
};

export default function Question(props) {
  const { classes, cx, t, store, render, index } = props;

  const url = useLocation();
  const previewMode = url.pathname.includes('detail');

  useEffect(() => {
    if (!store.questionMax || store.questionMax < index) {
      store.questionMax = index;
      render();
    }
  }, [index]);

  let className = cx(classes.loremIpsum, classes.limitedWidthStep);
  if (store.embedded) {
    className = cx(className, classes.loremIpsumEmbedded);
  }

  const showFirstButton = !props.isFirstStep && (!store.embedded || (store.embedded && index > 0));
  const isLastButton = index === store.questions.length - 1;
  const showLastButton = !store.embedded || (store.embedded && !isLastButton);

  const currentResponse = store.questionResponses?.[props.question.id].properties?.response;
  let allSelectsUsed = false;

  if (props.question.type === QUESTION_TYPES.MAP) {
    const currentResponses = store.questionResponses[props.question.id].properties?.responses || [];
    allSelectsUsed = true;

    forEach(props.question.mapProperties.markers.list, (_, i) => {
      if (!currentResponses.includes(i)) {
        allSelectsUsed = false;
      }
    });
  }

  const nextLabel = useMemo(() => {
    if (props.isLast) return t('finishButton');

    if (store?.config?.canOmitQuestions) {
      const questionType = props.question.type;
      return getNextLabelByQuestionType[questionType](currentResponse, t, allSelectsUsed);
    }

    return t('nextButton');
  }, [
    store.config.canOmitQuestions,
    currentResponse,
    props.isLast,
    props.question.type,
    allSelectsUsed,
    t,
  ]);

  const child = useMemo(() => {
    if (props.question.type === QUESTION_TYPES.MONO_RESPONSE) {
      return <MonoResponse {...props} isPreviewMode={previewMode} />;
    }
    if (props.question.type === QUESTION_TYPES.SHORT_RESPONSE) {
      return <ShortResponse {...props} isPreviewMode={previewMode} />;
    }
    if (props.question.type === QUESTION_TYPES.MAP) {
      return <Map {...props} isPreviewMode={previewMode} />;
    }
    if (props.question.type === QUESTION_TYPES.TRUE_FALSE) {
      return <TrueFalse {...props} isPreviewMode={previewMode} />;
    }
    if (props.question.type === QUESTION_TYPES.OPEN_RESPONSE) {
      return <OpenResponse {...props} isPreviewMode={previewMode} />;
    }
    return null;
  }, [props, previewMode]);

  const disableNext = useMemo(() => {
    if (store.config.canOmitQuestions) {
      return false;
    }

    if (
      props.question.type === QUESTION_TYPES.SHORT_RESPONSE ||
      props.question.type === QUESTION_TYPES.OPEN_RESPONSE
    ) {
      return !currentResponse;
    }
    if (props.question.type === QUESTION_TYPES.MONO_RESPONSE) {
      return !isNumber(currentResponse);
    }
    if (props.question.type === QUESTION_TYPES.MAP) {
      return !allSelectsUsed;
    }
    if (props.question.type === QUESTION_TYPES.TRUE_FALSE) {
      return typeof currentResponse !== 'boolean';
    }

    return false;
  }, [store?.config?.canOmitQuestions, currentResponse, allSelectsUsed, props.question?.type]);

  return (
    <TotalLayoutStepContainer
      fullWidth={!!store.viewMode}
      noMargin={!!store.viewMode}
      hasFooter={!!store.viewMode}
      clean={previewMode || store.viewMode}
      footerPadding={store.viewMode ? 0 : undefined}
      stepName={previewMode || store.viewMode ? '' : t('questions')}
      Footer={
        <TotalLayoutFooterContainer
          fixed
          style={{ zIndex: 100 }}
          showFooterBorder={store.viewMode}
          scrollRef={props.scrollRef}
          rightZone={
            <Box sx={{ minWidth: '120px' }}>
              {showLastButton && (
                <Box style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Button
                    position="left"
                    variant={isLastButton ? null : 'outline'}
                    rightIcon={<ChevRightIcon />}
                    rounded
                    loading={store.isLoading}
                    compact
                    onClick={async () => {
                      store.isLoading = true;
                      render();

                      if (!store.viewMode) props.saveQuestion();
                      await props.nextStep();

                      store.isLoading = false;
                      render();
                    }}
                    disabled={disableNext}
                  >
                    {store.embedded ? t('nextButton') : nextLabel || t('next')}
                  </Button>
                </Box>
              )}
            </Box>
          }
          leftZone={
            <Box sx={{ minWidth: '120px' }}>
              {showFirstButton && (
                <Button variant="outline" leftIcon={<ChevLeftIcon />} onClick={props.prevStep}>
                  {t('prev')}
                </Button>
              )}
            </Box>
          }
        >
          <Box
            sx={() => ({
              display: 'flex',
              justifyContent: 'center',
              marginLeft: '24px',
            })}
          >
            <Box sx={() => ({ maxWidth: '280px', width: '100%' })}>
              <ProgressBottomBar
                size="md"
                labelTop={`${index + 1} / ${store.questions.length}`}
                value={((index + 1) / store.questions.length) * 100}
              />
            </Box>
          </Box>
        </TotalLayoutFooterContainer>
      }
    >
      <Stack sx={{ width: !store.viewMode ? 878 : '100%' }}>
        <Box className={className}>
          <QuestionValue {...props} isPreviewMode={previewMode} />
          {child}
        </Box>
      </Stack>
    </TotalLayoutStepContainer>
  );
}

Question.propTypes = {
  classes: PropTypes.any,
  styles: PropTypes.any,
  t: PropTypes.any,
  cx: PropTypes.any,
  store: PropTypes.any,
  prevStep: PropTypes.func,
  nextStep: PropTypes.func,
  isFirstStep: PropTypes.bool,
  saveQuestion: PropTypes.func,
  question: PropTypes.any,
  render: PropTypes.func,
  index: PropTypes.number,
  isLast: PropTypes.number,
  scrollRef: PropTypes.any,
};
