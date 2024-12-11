import { useState, useMemo } from 'react';

import { Tabs, TabPanel, ContextContainer } from '@bubbles-ui/components';
import PropTypes from 'prop-types';

import QuestionResultsTable from './QuestionResultsTable';

import { QUESTION_RESPONSE_STATUS } from '@tests/constants';
import { QUESTION_TYPES } from '@tests/pages/private/questions-banks/questionConstants';

const TAB_KEYS = {
  OPEN_QUESTIONS: 'open-questions',
  TEST_QUESTIONS: 'test-questions',
};

export default function QuestionResultsForTeacher({
  questions,
  onReviewQuestion,
  questionResponses,
  ...props
}) {
  const [activeTabKey, setActiveTabKey] = useState(TAB_KEYS.OPEN_QUESTIONS);
  const [openResponseQuestions, testQuestions] = useMemo(
    () =>
      questions.reduce(
        (acc, question) => {
          const isOpenResponse = question.type === QUESTION_TYPES.OPEN_RESPONSE;
          acc[isOpenResponse ? 0 : 1].push(question);
          return acc;
        },
        [[], []]
      ),
    [questions]
  );

  const getNotGradedOpenQuestionsAmount = () => {
    const notGradedQuestions = openResponseQuestions.filter(
      (question) => questionResponses?.[question.id]?.status === QUESTION_RESPONSE_STATUS.NOT_GRADED
    );
    return notGradedQuestions.length;
  };

  return (
    <ContextContainer>
      {openResponseQuestions.length > 0 ? (
        <Tabs activeKey={activeTabKey} onChange={setActiveTabKey}>
          <TabPanel
            key={TAB_KEYS.OPEN_QUESTIONS}
            label={`${props.t('questionResultsTable.openQuestions')} (${getNotGradedOpenQuestionsAmount()})`}
          >
            <QuestionResultsTable
              {...props}
              questions={openResponseQuestions}
              onReviewQuestion={onReviewQuestion}
              questionResponses={questionResponses}
            />
          </TabPanel>
          <TabPanel
            key={TAB_KEYS.TEST_QUESTIONS}
            label={`${props.t('questionResultsTable.testQuestions')} (${testQuestions.length})`}
          >
            <QuestionResultsTable
              {...props}
              questions={testQuestions}
              questionResponses={questionResponses}
            />
          </TabPanel>
        </Tabs>
      ) : (
        <QuestionResultsTable
          {...props}
          questions={testQuestions}
          questionResponses={questionResponses}
        />
      )}
    </ContextContainer>
  );
}

QuestionResultsForTeacher.propTypes = {
  commonTableData: PropTypes.array,
  commonTableHeaders: PropTypes.array,
  questions: PropTypes.array,
  styles: PropTypes.object,
  t: PropTypes.func,
  onReviewQuestion: PropTypes.func,
  questionResponses: PropTypes.object,
};
