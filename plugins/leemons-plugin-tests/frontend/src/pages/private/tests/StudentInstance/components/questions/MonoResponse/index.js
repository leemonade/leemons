import { useMemo } from 'react';

import { Box, Stack } from '@bubbles-ui/components';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import PropTypes from 'prop-types';

import QuestionTitleComponent from '../../QuestionTitleComponent';
import StemResource from '../../StemResource';

import AnswerMode from './AnswerMode';
import Responses from './Responses';
import ViewModeResponses from './ViewModeResponses';

import prefixPN from '@tests/helpers/prefixPN';
import AnswerFeed from '@tests/pages/private/tests/components/ResponseDetail/AnswerFeed';

export default function Index(props) {
  const [t] = useTranslateLoader(prefixPN('testResult.responseDetail'));
  const { styles, store, question } = props;

  const containerClassName = store.viewMode
    ? styles.viewModeQuestionContainer
    : styles.executionModeQuestionContainer;

  // Temporary. Waiting for the new designs
  const ResolvedViewMode = useMemo(() => {
    const showOldViewModeResponses = question?.hasAnswerFeedback || question?.hasImageAnswers;

    if (!showOldViewModeResponses) {
      return <ViewModeResponses {...props} />;
    }

    return (
      <>
        <AnswerFeed questionStatus={store.questionResponses?.[question.id]?.status} t={t} />
        {!question.hasImageAnswer && question.stemResource ? (
          <Stack fullWidth sx={{ marginBottom: 46 }} spacing={4}>
            <Box>
              <StemResource {...props} asset={question.stemResource} />
            </Box>
            <Box>
              <Responses {...props} />
            </Box>
          </Stack>
        ) : (
          <Box sx={{ marginBottom: 72 }}>
            {question?.stemResource && <StemResource {...props} asset={question.stemResource} />}
            <Responses {...props} />
          </Box>
        )}
      </>
    );
  }, [question, store?.questionResponses, props, t]);

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

      {!store.viewMode ? <AnswerMode {...props} /> : ResolvedViewMode}
    </Box>
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
