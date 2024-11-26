import { useCallback, useMemo, useState } from 'react';

import { useIsTeacher } from '@academic-portfolio/hooks';
import { Box, Button, ContextContainer, Alert } from '@bubbles-ui/components';
import { cloneDeep } from 'lodash';
import PropTypes from 'prop-types';

import TeacherReview from '../../StudentInstance/components/questions/OpenResponse/TeacherReview';

import QuestionResultsForTeacher from './QuestionResultsForTeacher';
import QuestionResultsTable from './QuestionResultsTable';

import ViewModeQuestions from '@tests/components/ViewModeQuestions';

const VIEW_MODES = {
  TABLE: 'table',
  QUESTIONS_DETAIL: 'questions-detail',
  REVIEW: 'review',
};

export default function StudentResultsTable({
  questions,
  questionResponses,
  levels,
  styles,
  t,
  cx,
  ...props
}) {
  const [viewMode, setViewMode] = useState(VIEW_MODES.TABLE);
  const [questionToReviewProperties, setQuestionToReviewProperties] = useState(null);
  const isTeacher = useIsTeacher();

  const viewModeButtonLabel = useMemo(() => {
    if (viewMode === VIEW_MODES.QUESTIONS_DETAIL || viewMode === VIEW_MODES.REVIEW) {
      return t('returnToTable');
    }
    return t('showInTests');
  }, [viewMode, t]);

  // HANDLERS ····································································································

  const handleOnReviewQuestion = useCallback(
    (questionId) => {
      setViewMode(VIEW_MODES.REVIEW);
      setQuestionToReviewProperties({
        response: cloneDeep(questionResponses[questionId]),
        questionIndex: questions.findIndex((q) => q.id === questionId),
        question: questions.find((q) => q.id === questionId),
      });
    },
    [questionResponses, questions]
  );

  const handleViewModeChange = () => {
    if (viewMode === VIEW_MODES.QUESTIONS_DETAIL || viewMode === VIEW_MODES.REVIEW) {
      return setViewMode(VIEW_MODES.TABLE);
    }
    return setViewMode(VIEW_MODES.QUESTIONS_DETAIL);
  };

  // RENDERERS ····································································································

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
          isTeacher
          onReviewQuestion={handleOnReviewQuestion}
        />
      );

    return (
      <QuestionResultsTable
        questions={questions}
        questionResponses={questionResponses}
        styles={styles}
        t={t}
        levels={levels}
        cx={cx}
      />
    );
  }, [isTeacher, questions, questionResponses, styles, t, levels, cx, handleOnReviewQuestion]);

  const renderContent = useCallback(
    ({ viewMode, questionToReviewProperties }) => {
      if (viewMode === VIEW_MODES.QUESTIONS_DETAIL) {
        return <ViewModeQuestions store={{ ...props, questions, questionResponses }} />;
      }

      if (viewMode === VIEW_MODES.REVIEW) {
        return (
          <TeacherReview
            {...questionToReviewProperties}
            assignmentConfig={props.config}
            questionsInfo={props.questionsInfo}
            instance={props.instance}
            studentUserAgentId={props.studentUserAgentId}
          />
        );
      }

      return TableComponent;
    },
    [props, questions, questionResponses, TableComponent]
  );

  return (
    <ContextContainer
      titleRightZone={
        <Button variant="link" onClick={handleViewModeChange}>
          {viewModeButtonLabel}
        </Button>
      }
      title={`${t('questions')} (${questions?.length})`}
    >
      {isTeacher && (
        <Alert
          title={t('questionResultsTable.nonGradedQuestionsAlert.title')}
          severity="warning"
          closeable={false}
        >
          {t('questionResultsTable.nonGradedQuestionsAlert.description')}
        </Alert>
      )}
      <Box>
        {renderContent({
          viewMode,
          questionToReviewProperties,
        })}
      </Box>
    </ContextContainer>
  );
}

StudentResultsTable.propTypes = {
  questions: PropTypes.array,
  questionResponses: PropTypes.object,
  levels: PropTypes.array,
  styles: PropTypes.object,
  t: PropTypes.func,
  cx: PropTypes.func,
  config: PropTypes.object,
  questionsInfo: PropTypes.object,
  instance: PropTypes.object,
  studentUserAgentId: PropTypes.string,
};
