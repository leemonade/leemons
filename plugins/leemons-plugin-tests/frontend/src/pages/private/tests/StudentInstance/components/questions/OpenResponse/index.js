import { useIsStudent } from '@academic-portfolio/hooks';
import { Box, createStyles } from '@bubbles-ui/components';
import PropTypes from 'prop-types';

import QuestionNoteClues from '../../QuestionNoteClues';
import QuestionTitle from '../../QuestionTitle';
import UnansweredQuestionWarning from '../../UnansweredQuestionWarning';

import Responses from './Responses';
import ViewModeResponses from './ViewModeResponses';

const useStyles = createStyles((theme) => ({
  container: {
    gap: 8,
    display: 'flex',
    marginBottom: 16,
    flexDirection: 'column',
  },
}));

export default function Index(props) {
  const { styles, store, question } = props;
  const { classes } = useStyles();

  const isStudent = useIsStudent();
  let showNotAnsweredWarning = false;
  if (store.viewMode) {
    showNotAnsweredWarning = store.questionResponses[question.id].status === null;
  }

  return (
    <Box className={!store.viewMode ? styles.questionCard : classes.container}>
      <QuestionTitle {...props} tableViewMode={store.viewMode} />
      {showNotAnsweredWarning && <UnansweredQuestionWarning {...props} isStudent={isStudent} />}

      {!store.viewMode ? (
        <Responses {...props} />
      ) : (
        <ViewModeResponses {...props} isStudent={isStudent} />
      )}
      {!store.viewMode && <QuestionNoteClues {...props} customStyles={{ marginTop: 16 }} />}
    </Box>
  );
}

Index.propTypes = {
  styles: PropTypes.any,
  store: PropTypes.any,
  question: PropTypes.any,
};
