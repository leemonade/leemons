import React from 'react';
import PropTypes from 'prop-types';
import { ActivityCountdown, Box, Text, Title } from '@bubbles-ui/components';
import { ArrowLeftIcon } from '@bubbles-ui/icons/outline';
import dayjs from 'dayjs';
import * as duration from 'dayjs/plugin/duration';

dayjs.extend(duration);

function Step(props) {
  const { styles, t, store, index, onReturn } = props;
  return (
    <Box className={styles.questionStep}>
      <Box className={styles.questionStepBar}>
        <Box
          className={styles.questionStepBaInner}
          style={{ width: `${((store.questionMax + 1) / store.questions.length) * 100}%` }}
        />
      </Box>
      <Box className={styles.questionStepNumbers}>
        <Text size="lg" color="primary">
          {store.questionMax + 1}
        </Text>
        <Text size="md" color="quartiary">
          /{store.questions.length}
        </Text>
      </Box>
    </Box>
  );
}

export default function QuestionHeader(props) {
  const { styles, t, store, index, onReturn } = props;

  let endDate = null;
  if (!store.viewMode && store.instance?.duration && store.timestamps?.start) {
    const [value, unit] = store.instance.duration.split(' ');
    endDate = new Date(store.timestamps.start);
    endDate.setSeconds(endDate.getSeconds() + dayjs.duration({ [unit]: value }).asSeconds());
  }

  return (
    <Box className={styles.questionHeader}>
      <Box>
        {!store.embedded ? (
          <>
            <Box>
              <Text role="expressive" size="xs" color="soft">
                {t('questionNumber', { number: index + 1 })}
              </Text>
            </Box>
            {store.instance.assignable.asset.tagline ? (
              <Box>
                <Title order="3">{store.instance.assignable.asset.tagline}</Title>
              </Box>
            ) : null}
          </>
        ) : null}

        {store.embedded ? (
          <Box className={styles.returnToTable} onClick={onReturn}>
            <ArrowLeftIcon />
            <Box sx={(theme) => ({ paddingLeft: theme.spacing[3] })}>
              <Text role="productive" size="md" color="primary">
                {t('returnToTable')}
              </Text>
            </Box>
          </Box>
        ) : null}
      </Box>
      <Box>
        {endDate ? (
          <Box className={styles.countdownContainer}>
            <ActivityCountdown finish={endDate} />
          </Box>
        ) : null}
        <Step {...props} />
      </Box>
    </Box>
  );
}

QuestionHeader.propTypes = {
  classes: PropTypes.any,
  styles: PropTypes.any,
  t: PropTypes.any,
  cx: PropTypes.any,
  store: PropTypes.any,
  prevStep: PropTypes.func,
  nextStep: PropTypes.func,
  isFirstStep: PropTypes.bool,
  index: PropTypes.number,
  onReturn: PropTypes.func,
};
