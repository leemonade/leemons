import React from 'react';
import PropTypes from 'prop-types';
import { Box, ImageLoader, Title } from '@bubbles-ui/components';
import dayjs from 'dayjs';
import * as duration from 'dayjs/plugin/duration';
import InfoCard from './InfoCard';

dayjs.extend(duration);
export default function Development(props) {
  const { classes, styles, cx, t, store } = props;

  const durationSeconds = React.useMemo(() => {
    if (store.instance?.duration) {
      const [value, unit] = store.instance.duration.split(' ');
      return dayjs.duration({ [unit]: value }).asSeconds();
    }
    return null;
  }, [store.instance]);

  return (
    <Box className={cx(classes.loremIpsum, classes.limitedWidthStep)}>
      {store.instance.assignable.asset.tagline ? (
        <Title order={2}>{store.instance.assignable.asset.tagline}</Title>
      ) : null}

      <Box className={styles.resumeBoxContainer}>
        <InfoCard styles={styles} number={store.questionsInfo.questions} label={t('questions')} />
        <InfoCard
          styles={styles}
          number={store.questionsInfo.perQuestion}
          label={t('perQuestion')}
        />
      </Box>
      <Box className={styles.resumeBoxContainer}>
        <InfoCard
          styles={styles}
          number={store.questionsInfo.totalPoints}
          label={t('totalPoints')}
        />
        <InfoCard
          styles={styles}
          number={store.questionsInfo.minToApprove}
          label={t('minToApprove')}
        />
      </Box>

      <Box className={styles.timeLimitContainer}>
        <Title order={5}>{t('beforeStart')}</Title>
        <Box className={styles.timeLimitContent}>
          <Box className={styles.timeLimitInfo}>
            <Box>
              <Box sx={() => ({ position: 'relative', height: '24px', marginBottom: '24px' })}>
                <ImageLoader className="stroke-current" src={'/public/tests/clock.svg'} />
              </Box>
              <Title order={4}>
                <LocaleDuration />
              </Title>
            </Box>
            <Box>
              <Box sx={() => ({ position: 'relative', height: '32px', marginBottom: '16px' })}>
                <ImageLoader className="stroke-current" src={'/public/tests/pause.svg'} />
              </Box>
              <Title order={4}>Sin pausa</Title>
            </Box>
          </Box>
          <img className={styles.timeLimitImage} src="/public/tests/ninaBrazoLevantado.png" />
        </Box>
      </Box>
    </Box>
  );
}

Development.propTypes = {
  classes: PropTypes.any,
  styles: PropTypes.any,
  t: PropTypes.any,
  cx: PropTypes.any,
  store: PropTypes.any,
  prevStep: PropTypes.func,
  nextStep: PropTypes.func,
  isFirstStep: PropTypes.bool,
};
