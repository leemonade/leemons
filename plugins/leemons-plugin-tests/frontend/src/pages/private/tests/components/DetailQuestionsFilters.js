import React from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Checkbox,
  ContextContainer,
  InputWrapper,
  MultiSelect,
  NumberInput,
  Paragraph,
} from '@bubbles-ui/components';
import { Controller } from 'react-hook-form';
import { forIn, map } from 'lodash';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import prefixPN from '@tests/helpers/prefixPN';
import { TagsAutocomplete } from '@common';
import useLevelsOfDifficulty from '@assignables/components/LevelsOfDifficulty/hooks/useLevelsOfDifficulty';
import { questionTypeT } from '../../questions-banks/components/QuestionForm';

export default function DetailQuestionsFilters({ t, form, questionBank }) {
  const [t2] = useTranslateLoader(prefixPN('questionsBanksDetail'));
  const useAllQuestions = form.watch('useAllQuestions');
  const levels = useLevelsOfDifficulty();

  const questionTypes = [];
  forIn(questionTypeT, (value, key) => {
    questionTypes.push({ value: key, label: t2(value) });
  });

  const categoriesData = map(questionBank.categories, (category) => ({
    value: category.id,
    label: category.value,
  }));

  const questionsComponent = () => {
    const result = [
      <Box key={1}>
        <Controller
          control={form.control}
          name="type"
          shouldUnregister
          render={({ field }) => (
            <MultiSelect
              placeholder={t('all')}
              label={t('typeLabel')}
              data={questionTypes}
              {...field}
            />
          )}
        />
      </Box>,
    ];

    if (categoriesData.length > 0) {
      result.push(
        <Box key={2}>
          <Controller
            control={form.control}
            name="categories"
            shouldUnregister
            render={({ field }) => (
              <MultiSelect
                placeholder={t('all')}
                label={t('categoriesLabel')}
                data={categoriesData}
                {...field}
              />
            )}
          />
        </Box>
      );
    }

    result.push(
      <Box key={3}>
        <Controller
          control={form.control}
          name="level"
          shouldUnregister
          render={({ field }) => (
            <MultiSelect placeholder={t('all')} label={t('levelLabel')} data={levels} {...field} />
          )}
        />
      </Box>,
      <Box key={4}>
        <Controller
          control={form.control}
          name="tags"
          shouldUnregister
          render={({ field }) => (
            <TagsAutocomplete
              pluginName="tests"
              label={t('selectByTag')}
              labels={{ addButton: t('addTag') }}
              {...field}
            />
          )}
        />
      </Box>
    );

    return result;
  };

  return (
    <ContextContainer divided>
      <ContextContainer>
        <Box>
          <Paragraph>{t('questionFiltersDescription1')}</Paragraph>
          <Paragraph>{t('questionFiltersDescription2')}</Paragraph>
        </Box>

        <Box>
          <Controller
            control={form.control}
            name="useAllQuestions"
            render={({ field }) => (
              <Checkbox {...field} label={t('useAllQuestions')} checked={field.value} />
            )}
          />
        </Box>

        <Box>
          {!useAllQuestions ? (
            <InputWrapper label={t('numberOfQuestions')}>
              <Controller
                control={form.control}
                name="nQuestions"
                shouldUnregister
                rules={{
                  required: t('nQuestionsRequired'),
                  min: {
                    value: 1,
                    message: t('minOneQuestion'),
                  },
                }}
                render={({ field }) => (
                  <NumberInput
                    required
                    min={0}
                    error={form.formState.errors.nQuestions}
                    {...field}
                  />
                )}
              />
            </InputWrapper>
          ) : null}
        </Box>
        {!useAllQuestions ? questionsComponent() : null}
      </ContextContainer>
    </ContextContainer>
  );
}

DetailQuestionsFilters.propTypes = {
  t: PropTypes.func.isRequired,
  form: PropTypes.object.isRequired,
  questionBank: PropTypes.object,
};
