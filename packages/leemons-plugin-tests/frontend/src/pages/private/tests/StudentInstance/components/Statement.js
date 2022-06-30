import React from 'react';
import PropTypes from 'prop-types';
import { Box, HtmlText, Title } from '@bubbles-ui/components';
import { ButtonNavigation } from './ButtonNavigation';

export default function Statement(props) {
  const { classes, cx, t, store } = props;

  return (
    <Box className={cx(classes.loremIpsum, classes.limitedWidthStep)}>
      {store.instance.assignable.statement ? (
        <>
          <Title order={2}>{t('statement')}</Title>
          <Box className={classes.statementText}>
            <HtmlText>{store.instance.assignable.statement}</HtmlText>
          </Box>
        </>
      ) : null}
      <ButtonNavigation {...props} />
    </Box>
  );
}

Statement.propTypes = {
  classes: PropTypes.any,
  t: PropTypes.any,
  cx: PropTypes.any,
  store: PropTypes.any,
};
