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
  assignmentMode,
  assignmentQuestions,
}) => {
  const selectedCategories = form.watch('filters.categories');
  const selectedLevel = form.watch('filters.level');
  const levels = useLevelsOfDifficulty();

  useEffect(() => {
    form.setValue('config.filteredQuestions.level', selectedLevel);
    form.setValue('config.filteredQuestions.categories', selectedCategories);
    const filteredQuestionsTemp = assignmentMode
      ? assignmentQuestions.filter((question) => {
          const matchesCategory = selectedCategories?.length
            ? selectedCategories.includes(question.category)
            : true;
          const matchesLevel = selectedLevel?.length
            ? selectedLevel.includes(question.level)
            : true;
          return matchesCategory && matchesLevel;
        })
      : questionBank.questions?.filter((question) => {
          const matchesCategory = selectedCategories?.length
            ? selectedCategories.includes(question.category)
            : true;
          const matchesLevel = selectedLevel?.length
            ? selectedLevel.includes(question.level)
            : true;
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

  const checkifQuestionsHaveLevel = (questions) => questions?.every((question) => question.level);

  function filterLevelsByQuestions(questions, allLevels) {
    const levelsInQuestions = new Set(questions.map((question) => question.level));

    return allLevels.filter((level) => levelsInQuestions.has(level.value));
  }

  const levelsByQuestions = React.useMemo(
    () => filterLevelsByQuestions(filteredQuestions, levels),
    [filteredQuestions, levels]
  );

  const isMoreThanOneQuestionSelected =
    filteredQuestions?.length > 1
      ? t('selectionCounter', { n: filteredQuestions?.length })
      : t('selectionCounter', { n: filteredQuestions?.length }).slice(0, -1);
  return (
    <Box>
      {/* {!useAllQuestions ? ( */}
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
                  disabled={categoriesData.length === 0}
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
                  data={levelsByQuestions}
                  disabled={!checkifQuestionsHaveLevel(filteredQuestions)}
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
  assignmentMode: PropTypes.bool,
  assignmentQuestions: PropTypes.array,
};

FilteredQuestionsGenerator.defaultProps = {
  questionBank: {},
  classes: {},
  store: {},
  filteredQuestions: [],
  setFilteredQuestions: () => {},
  isNewTest: false,
  assignmentMode: false,
};

export { FilteredQuestionsGenerator };
