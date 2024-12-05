import { createStyles, Box } from '@bubbles-ui/components';
import { camelCase } from 'lodash';
import PropTypes from 'prop-types';

import ResponseStatusIcon from './ResponseStatusIcon';

import { QUESTION_RESPONSE_STATUS } from '@tests/constants';

const useAnswerFeedStyles = createStyles((theme, { status }) => {
  const questionStatusColors = {
    [QUESTION_RESPONSE_STATUS.OK]: theme.other.core.color.success['100'],
    [QUESTION_RESPONSE_STATUS.KO]: theme.other.core.color.danger['100'],
    [QUESTION_RESPONSE_STATUS.PARTIAL]: theme.other.core.color.attention['100'],
    [QUESTION_RESPONSE_STATUS.NOT_GRADED]: theme.other.core.color.attention['100'],
    'not-answered': theme.other.core.color.danger['100'],
  };

  return {
    wrapper: {
      backgroundColor: questionStatusColors[status ?? 'not-answered'],
      display: 'flex',
      flex: 1,
      alignItems: 'center',
      minHeight: 48,
      paddingInline: 16,
    },
    variant: {
      alignItems: 'center',
      flex: '1 1 100%',
      display: 'flex',
      gap: 8,
    },
    content: {
      ...theme.other.global.content.typo.body.sm,
      color: theme.other.global.content.color.text.default,
      lineHeight: 1,
      display: 'block',
      paddingTop: 2,
    },
    contentIcon: {
      display: 'flex',
      alignItems: 'center',
    },
  };
});

function AnswerFeed({ questionStatus, t }) {
  const { classes } = useAnswerFeedStyles({ status: questionStatus });

  return (
    <Box className={classes.wrapper} fullWidth alignItems="center">
      <Box className={classes.variant}>
        <Box className={classes.contentIcon}>
          <ResponseStatusIcon status={questionStatus} />
        </Box>
        <Box className={classes.content}>
          {t(`questionStatus.${camelCase(questionStatus ?? 'not-answered')}`)}
        </Box>
      </Box>
    </Box>
  );
}

AnswerFeed.propTypes = {
  t: PropTypes.func,
  questionStatus: PropTypes.string,
};

export default AnswerFeed;
