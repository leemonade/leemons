import React from 'react';

import {
  Button,
  HtmlText,
  TotalLayoutStepContainer,
  TotalLayoutFooterContainer,
  ContextContainer,
  Box,
} from '@bubbles-ui/components';
import { ChevRightIcon } from '@bubbles-ui/icons/outline';
import { LeebraryImage } from '@leebrary/components';
import PropTypes from 'prop-types';

const featuredImageStyle = {
  width: '100%',
  height: 'auto',
  objectFit: 'contain',
};

const IntroductionStep = ({ feedback, instance, t, onNext, scrollRef }) => {
  const handleOnNext = () => {
    onNext();
  };

  return (
    <TotalLayoutStepContainer
      Footer={
        <TotalLayoutFooterContainer
          fixed
          scrollRef={scrollRef}
          rightZone={
            <Button variant="outline" rightIcon={<ChevRightIcon />} onClick={handleOnNext}>
              {t('next')}
            </Button>
          }
        />
      }
    >
      <Box>
        <ContextContainer>
          {!!instance?.metadata?.statement && (
            <ContextContainer title={t('instructions')} justifyContent="start">
              <HtmlText>{instance.metadata?.statement}</HtmlText>
            </ContextContainer>
          )}
          <ContextContainer title={t('feedbackIntroductoryText')} justifyContent="start">
            <HtmlText>{feedback.introductoryText}</HtmlText>

            {feedback.featuredImage ? (
              <LeebraryImage src={feedback.featuredImage.id} style={featuredImageStyle} />
            ) : null}
          </ContextContainer>
        </ContextContainer>
      </Box>
    </TotalLayoutStepContainer>
  );
};

IntroductionStep.propTypes = {
  feedback: PropTypes.object,
  instance: PropTypes.object,
  t: PropTypes.func,
  onNext: PropTypes.func,
  scrollRef: PropTypes.any,
};

IntroductionStep.defaultProps = {
  onNext: () => {},
};

export default IntroductionStep;
