import React from 'react';
import PropTypes from 'prop-types';
import { Box, Text, Title } from '@bubbles-ui/components';

export default function QuestionHeader(props) {
  const { styles, t, store, index } = props;
  return (
    <Box className={styles.questionHeader}>
      <Box>
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
      </Box>
      <Box>
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
};
