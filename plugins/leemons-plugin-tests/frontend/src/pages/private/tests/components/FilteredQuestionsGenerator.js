import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Box, ContextContainer, MultiSelect, Text } from '@bubbles-ui/components';
import { Controller } from 'react-hook-form';
import useLevelsOfDifficulty from '@assignables/components/LevelsOfDifficulty/hooks/useLevelsOfDifficulty';

const FilteredQuestionsGenerator = ({
  t,
  form,
  questionBank,
  classes,
  filteredQuestions,
  setFilteredQuestions,
  isNewTest,
}) => {
  const useAllQuestions = form.watch('useAllQuestions');
  const selectedCategories = form.watch('filters.categories');
  const selectedLevel = form.watch('filters.level');
  const levels = useLevelsOfDifficulty();

  useEffect(() => {
    const filteredQuestionsTemp = questionBank.questions?.filter((question) => {
      const matchesCategory = selectedCategories?.length
        ? selectedCategories.includes(question.category)
        : true;
      const matchesLevel = selectedLevel?.length ? selectedLevel.includes(question.level) : true;
      return matchesCategory && matchesLevel;
    });
    setFilteredQuestions(filteredQuestionsTemp);
    form.setValue('questions', filteredQuestionsTemp?.map((question) => question.id) || []);
  }, [selectedCategories, selectedLevel, questionBank.questions, setFilteredQuestions, isNewTest]);

  const categoriesData = React.useMemo(() => {
    if (questionBank?.categories) {
      return questionBank.categories.map((category) => ({
        value: category.id,
        label: category.value,
      }));
    }
    return [];
  }, [questionBank?.categories]);

  const isMoreThanOneQuestionSelected =
    filteredQuestions?.length > 1
      ? t('selectionCounter', { n: filteredQuestions?.length })
      : t('selectionCounter', { n: filteredQuestions?.length }).slice(0, -1);
  return (
    <Box>
      {!useAllQuestions ? (
        <Box>
          <ContextContainer key={2} direction="row">
            <Controller
              control={form.control}
              name="filters.categories"
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
  filteredQuestions: PropTypes.array,
  setFilteredQuestions: PropTypes.func,
  isNewTest: PropTypes.bool,
};

export { FilteredQuestionsGenerator };
