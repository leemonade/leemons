import React from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  HtmlText,
  TotalLayoutStepContainer,
  TotalLayoutFooterContainer,
  ContextContainer,
} from '@bubbles-ui/components';
import { ChevRightIcon } from '@bubbles-ui/icons/outline';
import { LeebraryImage } from '@leebrary/components';

const featuredImageStyle = {
  width: '100%',
  height: 'auto',
  objectFit: 'contain',
};

const IntroductionStep = ({ feedback, t, onNext, scrollRef }) => {
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
      <ContextContainer title={t('feedbackIntroductoryText')} justifyContent="start">
        <HtmlText>{feedback.introductoryText}</HtmlText>

        {feedback.featuredImage ? (
          <LeebraryImage src={feedback.featuredImage.id} style={featuredImageStyle} />
        ) : null}
      </ContextContainer>
    </TotalLayoutStepContainer>
  );
};

IntroductionStep.propTypes = {
  feedback: PropTypes.object,
  t: PropTypes.func,
  onNext: PropTypes.func,
  scrollRef: PropTypes.any,
};

IntroductionStep.defaultProps = {
  onNext: () => {},
};

export default IntroductionStep;
