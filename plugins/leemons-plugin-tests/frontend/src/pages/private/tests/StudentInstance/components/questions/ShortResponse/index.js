import { Box } from '@bubbles-ui/components';
import PropTypes from 'prop-types';

import QuestionTitleComponent from '../../QuestionTitleComponent';

import AnswerMode from './AnswerMode';
import ViewModeResponses from './ViewModeResponses';

export default function Index(props) {
  const { styles, store, question } = props;

  const containerClassName = store.viewMode
    ? styles.viewModeQuestionContainer
    : styles.executionModeQuestionContainer;

  return (
    <Box className={containerClassName}>
      <QuestionTitleComponent
        question={question}
        questionIndex={store.questions?.findIndex((q) => q.id === question?.id)}
        questionResponse={store.questionResponses?.[question.id]}
        viewMode={store.viewMode}
        assignmentConfig={store.config}
        questionsInfo={store.questionsInfo}
      />

      {store.viewMode ? <ViewModeResponses {...props} /> : <AnswerMode {...props} />}
    </Box>
  );
}

Index.propTypes = {
  styles: PropTypes.any,
  store: PropTypes.any,
  question: PropTypes.any,
};
