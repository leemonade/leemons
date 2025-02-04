import { useState } from 'react';

import { Checkbox, Box, Table } from '@bubbles-ui/components';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { map } from 'lodash';
import PropTypes from 'prop-types';

import { getQuestionForTable } from '@tests/helpers/getQuestionForTable';
import prefixPN from '@tests/helpers/prefixPN';

function QuestionsTablePicker({ questions, onSelectQuestions }) {
  const [t] = useTranslateLoader(prefixPN('questionsBanksDetail'));
  const [selectedQuestions, setSelectedQuestions] = useState([]);

  function handleSelectQuestion(questionIndex) {
    let newSelectedQuestions = [];
    if (selectedQuestions.includes(questionIndex)) {
      newSelectedQuestions = selectedQuestions.filter((index) => index !== questionIndex);
    } else {
      newSelectedQuestions = [...selectedQuestions, questionIndex];
    }
    setSelectedQuestions(newSelectedQuestions);
    onSelectQuestions(questions.filter((_, index) => newSelectedQuestions.includes(index)));
  }

  const tableColumns = [
    {
      Header: () => (
        <Box style={{ width: '30px' }}>
          <Checkbox
            checked={selectedQuestions.length === questions.length}
            onChange={() => {
              if (selectedQuestions.length === questions.length) {
                setSelectedQuestions([]);
                onSelectQuestions([]);
              } else {
                setSelectedQuestions(questions.map((question, index) => index));
                onSelectQuestions(questions);
              }
            }}
          />
        </Box>
      ),
      accessor: 'checked',
      className: 'text-left',
    },
    {
      Header:
        selectedQuestions.length > 0
          ? `${selectedQuestions.length} ${t('selectedQuestions')}`
          : t('questionLabel'),
      accessor: 'question',
      className: 'text-left',
    },
    {
      Header: t('responsesLabel'),
      accessor: 'responses',
      className: 'text-left',
    },
    {
      Header: t('typeLabel'),
      accessor: 'type',
      className: 'text-left',
    },
  ];

  return (
    <Box>
      {questions?.length && (
        <Table
          selectable
          onSelect={onSelectQuestions}
          columns={tableColumns}
          data={map(questions, (question, i) => ({
            ...getQuestionForTable(question, t),
            checked: (
              <Box style={{ width: '30px' }}>
                <Checkbox
                  checked={selectedQuestions.includes(i)}
                  onChange={() => handleSelectQuestion(i)}
                />
              </Box>
            ),
          }))}
        />
      )}
    </Box>
  );
}

QuestionsTablePicker.propTypes = {
  questions: PropTypes.array.isRequired,
  onSelectQuestions: PropTypes.func.isRequired,
};

export { QuestionsTablePicker };
