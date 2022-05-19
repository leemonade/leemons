import React from 'react';
import PropTypes from 'prop-types';
import { Box, Text, Title } from '@bubbles-ui/components';
import { ButtonNavigation } from './ButtonNavigation';

export default function Resume(props) {
  const { classes, cx, t, store } = props;

  return (
    <Box className={cx(classes.loremIpsum, classes.limitedWidthStep)}>
      {store.instance.assignable.asset.description ? (
        <>
          <Title order={2}>{t('resume')}</Title>
          <Text color="primary" role="productive" strong className={classes.subtitle}>
            {store.instance.assignable.asset.description}
          </Text>
        </>
      ) : null}
      <ButtonNavigation {...props} />
    </Box>
  );
}

Resume.propTypes = {
  classes: PropTypes.any,
  t: PropTypes.any,
  cx: PropTypes.any,
  store: PropTypes.any,
  prevStep: PropTypes.func,
  nextStep: PropTypes.func,
  isFirstStep: PropTypes.bool,
};
