/* eslint-disable no-nested-ternary */
import { Alert, Box } from '@bubbles-ui/components';
import PropTypes from 'prop-types';

export default function UnansweredQuestionWarning({ t, isStudent }) {
  return (
    <Box sx={(theme) => ({ marginBottom: 8 })}>
      <Alert title={t('warnNoResponseTitle')} severity="warning" closeable={false}>
        {isStudent && t('warnNoResponseDescription')}
      </Alert>
    </Box>
  );
}

UnansweredQuestionWarning.propTypes = {
  t: PropTypes.any,
  isStudent: PropTypes.bool,
};
