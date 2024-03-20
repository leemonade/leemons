import React, { useState, useEffect } from 'react';
import { Box, Tabs, TabPanel, Title } from '@bubbles-ui/components';
import propTypes from 'prop-types';
import { Controller } from 'react-hook-form';
import QuestionsTable from './QuestionsTable';

const ManualQuestionsGenerator = ({
  t,
  form,
  questionBank,
  manualQuestions,
  setManualQuestions,
}) => {
  const [allQuestions, setAllQuestions] = useState([]);
  const formValues = form.watch();

  useEffect(() => {
    setAllQuestions(questionBank.questions);
    if (formValues?.config?.manualQuestions?.length > 0) {
      setManualQuestions(
        questionBank?.questions?.filter((q) => formValues.config.manualQuestions.includes(q.id))
      );
      form.setValue('questions', formValues.config.manualQuestions);
    }
  }, [questionBank]);
  const questions = form.watch('questions');
  const handleSelectionChange = (selectedIds) => {
    if (selectedIds.length === 0) {
      return form.setValue('questions', []);
    }
    form.setValue('config.manualQuestions', selectedIds);
    setManualQuestions(allQuestions.filter((q) => selectedIds.includes(q.id)));
    form.setValue('questions', selectedIds);
  };
  return (
    <Box>
      <Title order={4} style={{ visibility: questions?.length > 0 ? 'visible' : 'hidden' }}>
        {t('selectorManualCounter', {
          n: questions.length,
          x: allQuestions?.length,
        })}
      </Title>
      <Tabs position="left">
        <TabPanel label={t('allQuestions')}>
          <Controller
            key={3}
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
            name="config.manualQuestions"
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
  setManualQuestions: propTypes.func.isRequired,
};

ManualQuestionsGenerator.defaultProps = {
  t: () => {},
  form: {},
  questionBank: [],
  classes: {},
  finalQuestions: [],
  setFinalQuestions: () => {},
};

export { ManualQuestionsGenerator };
