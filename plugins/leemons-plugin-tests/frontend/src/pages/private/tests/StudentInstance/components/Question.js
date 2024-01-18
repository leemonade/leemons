import React from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Button,
  TotalLayoutFooterContainer,
  TotalLayoutStepContainer,
} from '@bubbles-ui/components';
import { ChevLeftIcon, ChevRightIcon } from '@bubbles-ui/icons/outline';
import { forEach, isNumber } from 'lodash';
import MonoResponse from './questions/MonoResponse';
import Map from './questions/Map';
import QuestionValue from './QuestionValue';

export default function Question(props) {
  const { classes, cx, t, store, render, index } = props;

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
  if (props.question.type === 'mono-response') {
    child = <MonoResponse {...props} />;
  }
  if (props.question.type === 'map') {
    child = <Map {...props} />;

    const currentResponses = store.questionResponses[props.question.id].properties?.responses || [];

    let allSelectsUsed = true;
    forEach(props.question.properties.markers.list, (response, i) => {
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
  if (isNumber(currentResponseIndex)) {
    disableNext = false;
  }

  return (
    <TotalLayoutStepContainer
      fullWidth={!!store.viewMode}
      noMargin={!!store.viewMode}
      hasFooter={!!store.viewMode}
      footerPadding={store.viewMode ? 0 : undefined}
      stepName={store.viewMode ? '' : t('questions')}
      Footer={
        <TotalLayoutFooterContainer
          fixed={!store.viewMode}
          showFooterBorder={store.viewMode}
          scrollRef={props.scrollRef}
          rightZone={
            <>
              {showLastButton ? (
                <Button
                  position="left"
                  variant={isLastButton ? null : 'outline'}
                  rightIcon={<ChevRightIcon />}
                  rounded
                  compact
                  onClick={props.nextStep}
                  disabled={disableNext}
                >
                  {store.embedded ? t('nextButton') : nextLabel || t('next')}
                </Button>
              ) : null}
            </>
          }
          leftZone={
            <>
              {showFirstButton ? (
                <Button variant="outline" leftIcon={<ChevLeftIcon />} onClick={props.prevStep}>
                  {t('prev')}
                </Button>
              ) : null}
            </>
          }
        />
      }
    >
      <Box className={className}>
        <QuestionValue {...props} />
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
  question: PropTypes.any,
  render: PropTypes.func,
  index: PropTypes.number,
};
