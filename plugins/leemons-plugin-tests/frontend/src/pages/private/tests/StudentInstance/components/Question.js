import React from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Button,
  ProgressBottomBar,
  TotalLayoutFooterContainer,
  TotalLayoutStepContainer,
} from '@bubbles-ui/components';
import { ChevLeftIcon, ChevRightIcon } from '@bubbles-ui/icons/outline';
import { forEach, isNumber } from 'lodash';
import { useLocation } from 'react-router-dom';
import { QUESTION_TYPES } from '@tests/pages/private/questions-banks/questionConstants';
import MonoResponse from './questions/MonoResponse';
import Map from './questions/Map';
import QuestionValue from './QuestionValue';

export default function Question(props) {
  const { classes, cx, t, store, render, index } = props;

  const url = useLocation();
  const previewMode = url.pathname.includes('detail');

  React.useEffect(() => {
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

  const currentResponseIndex = store.questionResponses?.[props.question.id].properties?.response;
  let allSelectsUsed = false;

  let nextLabel = null;
  if (store.config.canOmitQuestions) {
    nextLabel = isNumber(currentResponseIndex) ? t('nextButton') : t('skipButton');
  } else {
    nextLabel = t('nextButton');
  }
  if (props.isLast) {
    nextLabel = t('finishButton');
  }

  let child = null;
  if (props.question.type === QUESTION_TYPES.MONO_RESPONSE) {
    child = <MonoResponse {...props} isPreviewMode={previewMode} />;
  }
  if (props.question.type === QUESTION_TYPES.MAP) {
    child = <Map {...props} isPreviewMode={previewMode} />;

    const currentResponses = store.questionResponses[props.question.id].properties?.responses || [];

    allSelectsUsed = true;
    forEach(props.question.mapProperties.markers.list, (response, i) => {
      if (!currentResponses.includes(i)) {
        allSelectsUsed = false;
      }
    });

    // eslint-disable-next-line no-nested-ternary
    nextLabel = props.isLast
      ? t('finishButton')
      : allSelectsUsed
      ? t('nextButton')
      : t('skipButton');
  }

  let disableNext = !store.config.canOmitQuestions;
  if (isNumber(currentResponseIndex) || allSelectsUsed) {
    disableNext = false;
  }

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
          fixed={!store.viewMode}
          showFooterBorder={store.viewMode}
          scrollRef={props.scrollRef}
          rightZone={
            <Box sx={{ minWidth: '120px' }}>
              {showLastButton ? (
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
              ) : null}
            </Box>
          }
          leftZone={
            <Box sx={{ minWidth: '120px' }}>
              {showFirstButton ? (
                <Button variant="outline" leftIcon={<ChevLeftIcon />} onClick={props.prevStep}>
                  {t('prev')}
                </Button>
              ) : null}
            </Box>
          }
        >
          <Box sx={() => ({ display: 'flex', justifyContent: 'center', marginLeft: '24px' })}>
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
      <Box className={className}>
        <QuestionValue {...props} isPreviewMode={previewMode} />
        {child}
      </Box>
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
};
