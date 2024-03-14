import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Box, ContextContainer, MultiSelect, Text } from '@bubbles-ui/components';
import { Controller } from 'react-hook-form';
import { map } from 'lodash';
import useLevelsOfDifficulty from '@assignables/components/LevelsOfDifficulty/hooks/useLevelsOfDifficulty';

const FilteredQuestionsGenerator = ({
  t,
  form,
  questionBank,
  classes,
  finalQuestions,
  setFinalQuestions,
}) => {
  const useAllQuestions = form.watch('useAllQuestions');
  const selectedCategories = form.watch('filters.categories');
  const selectedLevel = form.watch('filters.level');
  const levels = useLevelsOfDifficulty();

  useEffect(() => {
    const filteredQuestions = questionBank.questions?.filter((question) => {
      const matchesCategory = selectedCategories?.length
        ? selectedCategories.includes(question.category)
        : true;
      const matchesLevel = selectedLevel?.length ? selectedLevel.includes(question.level) : true;
      return matchesCategory && matchesLevel;
    });
    setFinalQuestions(filteredQuestions);
  }, [selectedCategories, selectedLevel, questionBank.questions, setFinalQuestions]);

  const categoriesData = map(questionBank.categories, (category) => ({
    value: category.id,
    label: category.value,
  }));
  const isMoreThanOneQuestionSelected =
    finalQuestions?.length > 1
      ? t('selectionCounter', { n: finalQuestions?.length })
      : t('selectionCounter', { n: finalQuestions?.length }).slice(0, -1);
  return (
    <Box>
      {!useAllQuestions ? (
        <Box>
          <ContextContainer key={2} direction="row">
            <Controller
              control={form.control}
              name="filters.categories"
              shouldUnregister
              render={({ field }) => (
                <Box className={classes?.containerMultiSelect}>
                  <MultiSelect
                    placeholder={t('all')}
                    label={t('categoriesLabel')}
                    data={categoriesData}
                    onChange={(e) => field.onChange(e)}
                    {...field}
                  />
                </Box>
              )}
            />
            <Controller
              control={form.control}
              name="filters.level"
              shouldUnregister
              render={({ field }) => (
                <Box className={classes?.containerMultiSelect}>
                  <MultiSelect
                    placeholder={t('all')}
                    label={t('levelLabel')}
                    data={levels}
                    onChange={(e) => field.onChange(e)}
                    {...field}
                  />
                </Box>
              )}
            />
          </ContextContainer>
          <Box className={classes.selectedCounter}>
            <Text>{isMoreThanOneQuestionSelected}</Text>
          </Box>
        </Box>
      ) : null}
    </Box>
  );
};

FilteredQuestionsGenerator.propTypes = {
  t: PropTypes.func.isRequired,
  form: PropTypes.object.isRequired,
  questionBank: PropTypes.object,
  classes: PropTypes.object,
  store: PropTypes.object,
  finalQuestions: PropTypes.array,
  setFinalQuestions: PropTypes.func,
};

export { FilteredQuestionsGenerator };
