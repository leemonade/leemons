import React from 'react';
import PropTypes from 'prop-types';
import { Box, HtmlText, Title } from '@bubbles-ui/components';
import { ButtonNavigation } from './ButtonNavigation';

export default function Resume(props) {
  const { classes, cx, t, store } = props;

  return (
    <Box className={cx(classes.loremIpsum, classes.limitedWidthStep)}>
      {store.instance?.assignable?.statement ? (
        <>
          <Title order={2}>{t('resume')}</Title>
          <Box sx={(theme) => ({ marginTop: theme.spacing[4], marginBottom: theme.spacing[4] })}>
            <HtmlText>{store.instance.assignable.statement}</HtmlText>
          </Box>
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
