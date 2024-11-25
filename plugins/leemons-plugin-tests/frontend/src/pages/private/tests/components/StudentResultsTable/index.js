import { useMemo, useState } from 'react';

import { useIsTeacher } from '@academic-portfolio/hooks';
import { Box, Button, ContextContainer, Alert } from '@bubbles-ui/components';
import PropTypes from 'prop-types';

import QuestionResultsForTeacher from './QuestionResultsForTeacher';
import TestsQuestionResultsTable from './TestQuestionResultsTable';

import ViewModeQuestions from '@tests/components/ViewModeQuestions';

export default function StudentResultsTable({
  questions,
  questionResponses,
  levels,
  styles,
  t,
  cx,
  ...props
}) {
  const [useQuestionMode, setUseQuestionMode] = useState(false);

  const isTeacher = useIsTeacher();
  console.log('isTeacher', isTeacher);

  const TableComponent = useMemo(() => {
    if (isTeacher)
      return (
        <QuestionResultsForTeacher
          questions={questions}
          questionResponses={questionResponses}
          styles={styles}
          t={t}
          levels={levels}
          cx={cx}
        />
      );
    return (
      <TestsQuestionResultsTable
        questions={questions}
        questionResponses={questionResponses}
        styles={styles}
        t={t}
        levels={levels}
        cx={cx}
      />
    );
  }, [isTeacher, questions, questionResponses, styles, t, levels, cx]);

  return (
    <>
      {isTeacher && (
        <Alert title="🌎 Preguntas por corregir" severity="warning">
          Evalúa las preguntas de respuesta abierta para enviar la nota final a los estudiantes. 🌎
        </Alert>
      )}
      <ContextContainer
        titleRightZone={
          <Button variant="link" onClick={() => setUseQuestionMode(!useQuestionMode)}>
            {useQuestionMode ? t('returnToTable') : t('showInTests')}
          </Button>
        }
        title={`${t('questions')} (${questions?.length})`}
      >
        <Box>
          {useQuestionMode ? (
            <ViewModeQuestions
              store={{ ...props, questions, questionResponses }}
              onReturn={() => setUseQuestionMode(false)}
            />
          ) : (
            TableComponent
          )}
        </Box>
      </ContextContainer>
    </>
  );
}

StudentResultsTable.propTypes = {
  questions: PropTypes.array,
  questionResponses: PropTypes.object,
  levels: PropTypes.array,
  styles: PropTypes.object,
  t: PropTypes.func,
  cx: PropTypes.func,
};
