import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Paper, ContextContainer, ImageLoader, Box, Button } from '@bubbles-ui/components';

function WelcomeStepCard({ t, step, disabled, to, onClick }) {
  return (
    <Paper>
      <ContextContainer>
        <ImageLoader src="" withPlaceholder height={100} noFlex />
        <ContextContainer title={t(`${step}.title`)} description={t(`${step}.description`)}>
          <Box noFlex>
            <Button
              as={disabled ? undefined : Link}
              to={disabled ? undefined : to}
              fullWidth
              onClick={disabled ? () => {} : onClick}
              disabled={disabled}
            >
              {t(`${step}.btn`)}
            </Button>
          </Box>
        </ContextContainer>
      </ContextContainer>
    </Paper>
  );
}

WelcomeStepCard.propTypes = {
  t: PropTypes.func,
  step: PropTypes.string,
  disabled: PropTypes.bool,
  to: PropTypes.string,
  onClick: PropTypes.func,
};

// eslint-disable-next-line import/prefer-default-export
export { WelcomeStepCard };
