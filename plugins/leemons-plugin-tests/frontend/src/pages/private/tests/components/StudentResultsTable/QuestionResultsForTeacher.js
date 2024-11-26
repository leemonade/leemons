import { useState, useMemo } from 'react';

import { Tabs, TabPanel, ContextContainer } from '@bubbles-ui/components';
import PropTypes from 'prop-types';

import QuestionResultsTable from './QuestionResultsTable';

import { QUESTION_TYPES } from '@tests/pages/private/questions-banks/questionConstants';

const TAB_KEYS = {
  OPEN_QUESTIONS: 'open-questions',
  TEST_QUESTIONS: 'test-questions',
};

export default function QuestionResultsForTeacher({ questions, onReviewQuestion, ...props }) {
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

  return (
    <ContextContainer>
      {openResponseQuestions.length > 0 ? (
        <Tabs activeKey={activeTabKey} onChange={setActiveTabKey}>
          <TabPanel
            key={TAB_KEYS.OPEN_QUESTIONS}
            label={`${props.t('questionResultsTable.openQuestions')} (${openResponseQuestions.length})`}
          >
            <QuestionResultsTable
              {...props}
              questions={openResponseQuestions}
              onlyOpenResponseQuestions
              onReviewQuestion={onReviewQuestion}
            />
          </TabPanel>
          <TabPanel
            key={TAB_KEYS.TEST_QUESTIONS}
            label={`${props.t('questionResultsTable.testQuestions')} (${testQuestions.length})`}
          >
            <QuestionResultsTable {...props} questions={testQuestions} />
          </TabPanel>
        </Tabs>
      ) : (
        <QuestionResultsTable {...props} questions={testQuestions} />
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
};
