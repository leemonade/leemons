/* eslint-disable no-unused-expressions */
import React from 'react';
import PropTypes from 'prop-types';
import { HtmlText, Stack, Title } from '@bubbles-ui/components';
import { LeebraryImage } from '@leebrary/components';
import WelcomeCardStyles from './WelcomeCard.styles';

const WelcomeCard = ({ feedback, t }) => {
  const { classes } = WelcomeCardStyles({}, { name: 'WelcomeCard' });

  return (
    <Stack className={classes.root} direction="column" spacing={4}>
      <Title order={3}>{t('feedbackIntroductoryText')}</Title>
      <HtmlText>{feedback.introductoryText}</HtmlText>

      {feedback.featuredImage ? (
        <LeebraryImage src={feedback.featuredImage.id} className={classes.image} />
      ) : null}
    </Stack>
  );
};

WelcomeCard.propTypes = {
  feedback: PropTypes.object,
  t: PropTypes.func,
};

WelcomeCard.defaultProps = {};

export default WelcomeCard;
