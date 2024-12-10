/* eslint-disable no-nested-ternary */

import { Box, Stack } from '@bubbles-ui/components';
import PropTypes from 'prop-types';

import QuestionNoteClues from '../../QuestionNoteClues';
import QuestionTitle from '../../QuestionTitle';
import StemResource from '../../StemResource';
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
        {!question.hasImageAnswer && question.stemResource ? (
          <>
            <Stack fullWidth spacing={4}>
              <Box>
                <StemResource {...props} asset={question.stemResource} />
              </Box>
              <Box>
                <Responses {...props} />
              </Box>
            </Stack>
          </>
        ) : (
          <>
            {question?.stemResource && <StemResource {...props} asset={question.stemResource} />}
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
