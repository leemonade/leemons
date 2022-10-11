import React from 'react';
import PropTypes from 'prop-types';
import { Box, Button, ImageLoader, Modal, Paragraph, Text, Title } from '@bubbles-ui/components';
import dayjs from 'dayjs';
import * as duration from 'dayjs/plugin/duration';
import { getLocaleDuration, LocaleDuration } from '@common';
import { AlertInformationCircleIcon } from '@bubbles-ui/icons/solid';
import { useSession } from '@users/session';
import { ChevronLeftIcon, ChevronRightIcon } from '@bubbles-ui/icons/outline';

import { find } from 'lodash';
import InfoCard from './InfoCard';

dayjs.extend(duration);
export default function Development(props) {
  const session = useSession();
  const [showModal, setShowModal] = React.useState(false);
  const { classes, styles, cx, t, store, nextStep, prevStep, onStartQuestions } = props;

  const durationSeconds = React.useMemo(() => {
    if (store.instance?.duration) {
      const [value, unit] = store.instance.duration.split(' ');
      return dayjs.duration({ [unit]: value }).asSeconds();
    }
    return null;
  }, [store.instance]);

  let clueEl = null;
  const cluePer = find(store.config.clues, (cl) => cl.canUse);

  if (cluePer) {
    const cluePoints = store.questionsInfo.perQuestionNumber * (cluePer.value / 100);
    clueEl = (
      <Box className={styles.resumeBoxContainer}>
        <InfoCard
          cx={cx}
          icon="/public/tests/hint.png"
          styles={styles}
          withRedColor={cluePer.value !== 0}
          label={
            cluePer.value !== 0
              ? t('clueWithPer', {
                  per: cluePer.value,
                  points: `-${cluePoints.toFixed(2)}`,
                })
              : t('clueWithoutPer')
          }
        />
      </Box>
    );
  }

  return (
    <Box className={cx(classes.loremIpsum, classes.limitedWidthStep)}>
      <Box
        sx={(theme) => ({
          marginBottom: theme.spacing[6],
          textAlign: 'center',
        })}
      >
        <Text role="productive" size="xs" color="soft">
          {t('test')}
        </Text>
        <Title order={2}>{t('instructionsForTest')}</Title>
      </Box>

      <Box className={styles.resumeBoxContainer}>
        <InfoCard
          cx={cx}
          styles={styles}
          number={store.questionsInfo.questions}
          label={t('questions')}
        />
        <InfoCard
          cx={cx}
          styles={styles}
          number={store.questionsInfo.perQuestion}
          label={t('perQuestion')}
        />
        {store.questionsInfo.minPoints !== 0 ? (
          <InfoCard
            cx={cx}
            styles={styles}
            number={store.questionsInfo.minPoints}
            label={t('minScore')}
          />
        ) : null}
        <InfoCard
          cx={cx}
          styles={styles}
          number={store.questionsInfo.totalPoints}
          label={t('maxScore')}
        />
        <InfoCard
          cx={cx}
          styles={styles}
          number={store.questionsInfo.minToApprove}
          label={t('minToApprove')}
        />
      </Box>

      <Box className={styles.resumeBoxContainer}>
        <InfoCard
          cx={cx}
          icon="/public/tests/blank-questions.png"
          styles={styles}
          withRedColor={
            !store.config.canOmitQuestions || (store.config.canOmitQuestions && store.config.omit)
          }
          label={
            // eslint-disable-next-line no-nested-ternary
            store.config.canOmitQuestions
              ? store.config.omit
                ? t('blankQuestionsScores', {
                    per: store.config.omit,
                    points: store.questionsInfo.perOmitQuestion,
                  })
                : t('blankQuestions')
              : t('noBlankQuestions')
          }
        />
      </Box>

      <Box className={styles.resumeBoxContainer}>
        <InfoCard
          cx={cx}
          icon="/public/tests/error-questions.png"
          styles={styles}
          withRedColor={store.config.wrong}
          label={
            store.config.wrong
              ? t('errorQuestions', {
                  per: store.config.wrong,
                  points: store.questionsInfo.perErrorQuestion,
                })
              : t('noErrorQuestions')
          }
        />
      </Box>

      {clueEl}

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
          {/* <img className={styles.timeLimitImage} src="/public/tests/ninaBrazoLevantado.png" /> */}
          {durationSeconds ? (
            <Box
              sx={() => ({
                position: 'absolute',
                bottom: '0px',
                width: '100%',
                textAlign: 'center',
              })}
            >
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
            </Box>
          ) : null}
        </Box>

        <Box className={classes.continueButton}>
          <Button
            position="right"
            variant="light"
            leftIcon={<ChevronLeftIcon />}
            rounded
            compact
            onClick={prevStep}
          >
            {t('prev')}
          </Button>

          <Button
            position="left"
            rightIcon={<ChevronRightIcon />}
            rounded
            compact
            onClick={() => {
              nextStep();
              onStartQuestions();
            }}
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
          <Paragraph
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
          <Paragraph
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
  onStartQuestions: PropTypes.func,
};
