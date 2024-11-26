/* eslint-disable no-nested-ternary */

import { Box, Stack } from '@bubbles-ui/components';
import PropTypes from 'prop-types';

import QuestionImage from '../../QuestionImage';
import QuestionNoteClues from '../../QuestionNoteClues';
import QuestionTitle from '../../QuestionTitle';
import UnansweredQuestionWarning from '../../UnansweredQuestionWarning';

import Responses from './Responses';

export default function Index(props) {
  const { styles, store, question } = props;

  let showNotAnsweredWarning = false;
  if (store.viewMode) {
    showNotAnsweredWarning = store.questionResponses[question.id].status === null;
  }

  return (
    <>
      {showNotAnsweredWarning ? <UnansweredQuestionWarning {...props} /> : null}

      <Box className={styles.questionCard}>
        <QuestionTitle {...props} tableViewMode={store.viewMode} />
        <QuestionNoteClues {...props} />
        {!question.hasImageAnswer && question.questionImage?.cover ? (
          <>
            <Stack fullWidth spacing={4}>
              <Box>
                <QuestionImage {...props} />
              </Box>
              <Box>
                <Responses {...props} />
              </Box>
            </Stack>
          </>
        ) : (
          <>
            <QuestionImage {...props} />
            <Responses {...props} />
          </>
        )}
      </Box>
    </>
  );
}

Index.propTypes = {
  classes: PropTypes.any,
  styles: PropTypes.any,
  t: PropTypes.any,
  cx: PropTypes.any,
  store: PropTypes.any,
  question: PropTypes.any,
  prevStep: PropTypes.func,
  nextStep: PropTypes.func,
  isLast: PropTypes.bool,
  isFirstStep: PropTypes.bool,
  saveQuestion: PropTypes.func,
};
