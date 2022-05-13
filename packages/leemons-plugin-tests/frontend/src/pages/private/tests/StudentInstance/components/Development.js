import React from 'react';
import PropTypes from 'prop-types';
import { Box, Button, ImageLoader, Modal, Text, Title } from '@bubbles-ui/components';
import dayjs from 'dayjs';
import * as duration from 'dayjs/plugin/duration';
import { getLocaleDuration, LocaleDuration } from '@common';
import { ChevronRightIcon } from '@bubbles-ui/icons/outline';
import { AlertInformationCircleIcon } from '@bubbles-ui/icons/solid';
import { useSession } from '@users/session';

import InfoCard from './InfoCard';

dayjs.extend(duration);
export default function Development(props) {
  const session = useSession();
  const [showModal, setShowModal] = React.useState(false);
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
                {durationSeconds ? <LocaleDuration seconds={durationSeconds} /> : t('noTimeLimit')}
              </Title>
            </Box>
            {durationSeconds ? (
              <Box>
                <Box sx={() => ({ position: 'relative', height: '32px', marginBottom: '16px' })}>
                  <ImageLoader className="stroke-current" src={'/public/tests/pause.svg'} />
                </Box>
                <Title order={4}>{t('withoutPause')}</Title>
              </Box>
            ) : null}
          </Box>
          <img className={styles.timeLimitImage} src="/public/tests/ninaBrazoLevantado.png" />
        </Box>

        <Box className={classes.continueButton}>
          <Button
            position="right"
            variant="link"
            rightIcon={<AlertInformationCircleIcon />}
            rounded
            compact
            onClick={() => setShowModal(true)}
          >
            {t('howItWorks')}
          </Button>

          <Button
            position="left"
            rightIcon={<ChevronRightIcon />}
            style={{ width: 338 }}
            rounded
            compact
          >
            {t('makeTheTest')}
          </Button>
        </Box>
      </Box>
      <Modal title={t('howItWorks')} opened={showModal} onClose={() => setShowModal(false)}>
        <Box className={styles.howItWorksModalContainer}>
          <Title order={5} sx={(theme) => ({ marginBottom: theme.spacing[2] })}>
            {t('limitedTime')}
          </Title>
          <Text
            dangerouslySetInnerHTML={{
              __html: t('limitedTimeDescription', {
                time: getLocaleDuration({ seconds: durationSeconds }, session),
              }),
            }}
          />

          <Title
            order={5}
            sx={(theme) => ({
              marginTop: theme.spacing[6],
              marginBottom: theme.spacing[2],
            })}
          >
            {t('canNotStop')}
          </Title>
          <Text
            dangerouslySetInnerHTML={{
              __html: t('canNotStopDescription', {
                time: getLocaleDuration({ seconds: durationSeconds }, session),
              }),
            }}
          />
        </Box>
      </Modal>
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
