import { useState } from 'react';

import { Tabs, TabPanel, ContextContainer } from '@bubbles-ui/components';
import PropTypes from 'prop-types';

import OpenQuestionsTable from './OpenQuestionsTable';
import TestsQuestionResultsTable from './TestQuestionResultsTable';

const TAB_KEYS = {
  OPEN_QUESTIONS: 'open-questions',
  TEST_QUESTIONS: 'test-questions',
};

export default function QuestionResultsForTeacher(props) {
  const [activeTabKey, setActiveTabKey] = useState(TAB_KEYS.OPEN_QUESTIONS);

  // todo paola: only tabs if there is at least one open question
  return (
    <ContextContainer>
      <Tabs activeKey={activeTabKey} onChange={setActiveTabKey}>
        <TabPanel key={TAB_KEYS.OPEN_QUESTIONS} label="foo">
          <OpenQuestionsTable {...props} />
        </TabPanel>
        <TabPanel key={TAB_KEYS.TEST_QUESTIONS} label="bar">
          <TestsQuestionResultsTable {...props} />
        </TabPanel>
      </Tabs>
    </ContextContainer>
  );
}

QuestionResultsForTeacher.propTypes = {
  commonTableData: PropTypes.array,
  commonTableHeaders: PropTypes.array,
  questions: PropTypes.array,
  styles: PropTypes.object,
  t: PropTypes.func,
};
