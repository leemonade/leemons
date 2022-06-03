import React from 'react';
import dayjs from 'dayjs';
import PropTypes from 'prop-types';
import { Box, HtmlText, Title } from '@bubbles-ui/components';
import { ButtonNavigation } from './ButtonNavigation';

export default function Resume(props) {
  const { classes, cx, t, store, styles } = props;

  let canStart = true;

  if (store.instance.dates?.start) {
    const now = new Date();
    const start = new Date(store.instance.dates.start);
    if (now < start) {
      canStart = false;
    }
  }

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
      {canStart ? (
        <ButtonNavigation {...props} />
      ) : (
        <Box className={styles.timeLimitContainer} style={{ margin: 0 }}>
          <Title order={5}>{t('importantInformation')}</Title>
          <Box className={styles.timeLimitContent}>
            <Box
              className={styles.timeLimitInfo}
              sx={(theme) => ({
                paddingLeft: theme.spacing[6],
                gap: theme.spacing[4],
                textAlign: 'left',
                flexDirection: 'column',
              })}
            >
              <Box>{t('informationOnlyView')}</Box>
              <Box>
                {t('informationStart', {
                  date: `${dayjs(store.instance.dates.start).format('L - HH:mm ')}h`,
                })}
              </Box>
            </Box>
            <img className={styles.timeLimitImage} src="/public/tests/ninaBrazoLevantado.png" />
          </Box>
        </Box>
      )}
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
  styles: PropTypes.any,
};
