import React, { useState, useEffect } from 'react';
import { Box, Tabs, TabPanel, Title } from '@bubbles-ui/components';
import propTypes from 'prop-types';
import { Controller } from 'react-hook-form';
import QuestionsTable from './QuestionsTable';

const ManualQuestionsGenerator = ({ t, form, questionBank, manualQuestions }) => {
  const [allQuestions, setAllQuestions] = useState([]);

  useEffect(() => {
    setAllQuestions(questionBank.questions);
  }, [questionBank]);
  const questions = form.watch('questions');
  const handleSelectionChange = (selectedIds) => {
    form.setValue('questions', selectedIds);
  };
  return (
    <Box>
      <Title order={4} style={{ visibility: questions.length > 0 ? 'visible' : 'hidden' }}>
        {t('selectorManualCounter', {
          n: questions.length,
          x: allQuestions?.length,
        })}
      </Title>
      <Tabs position="left">
        <TabPanel label={t('allQuestions')}>
          <Controller
            key={4}
            control={form.control}
            name="questions"
            render={({ field }) => (
              <QuestionsTable
                questions={allQuestions}
                value={field.value}
                onChange={(e) => {
                  handleSelectionChange(e);
                  return field.onChange(e);
                }}
                questionBank={questionBank}
                reorderMode={false}
                hideOpenIcon
              />
            )}
          />
        </TabPanel>
        <TabPanel label={t('questionsSelected')}>
          <Controller
            key={4}
            control={form.control}
            name="questions"
            render={({ field }) => (
              <QuestionsTable
                questions={manualQuestions}
                forceSortable
                value={field.value}
                onChange={(e) => field.onChange(e)}
                questionBank={questionBank}
                reorderMode={true}
                hideCheckbox
                hideOpenIcon
              />
            )}
          />
        </TabPanel>
      </Tabs>
    </Box>
  );
};

ManualQuestionsGenerator.propTypes = {
  t: propTypes.func.isRequired,
  form: propTypes.object.isRequired,
  questionBank: propTypes.array.isRequired,
  classes: propTypes.object.isRequired,
  manualQuestions: propTypes.array.isRequired,
};

ManualQuestionsGenerator.defaultProps = {
  t: () => {},
  form: {},
  questionBank: [],
  classes: {},
  finalQuestions: [],
};

export { ManualQuestionsGenerator };
