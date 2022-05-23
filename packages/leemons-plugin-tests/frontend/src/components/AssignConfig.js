import React from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Button,
  Checkbox,
  COLORS,
  ContextContainer,
  InputWrapper,
  MultiSelect,
  NumberInput,
  Stack,
  Text,
  Title,
} from '@bubbles-ui/components';
import { ChevLeftIcon } from '@bubbles-ui/icons/outline';
import { filter, forEach, includes, map } from 'lodash';
import useLevelsOfDifficulty from '@assignables/components/LevelsOfDifficulty/hooks/useLevelsOfDifficulty';
import { Controller, useForm } from 'react-hook-form';

export default function AssignConfig({ defaultValues: dv, test, t, onBack, onSend }) {
  let defaultValues = {};
  if (dv) {
    if (dv.filters) {
      defaultValues = { ...dv.filters };
    }
    if (dv.questions) {
      defaultValues.questions = dv.questions;
    }
  }

  const form = useForm({ defaultValues });
  const useAllQuestions = form.watch('useAllQuestions');
  const nQuestions = form.watch('nQuestions');
  const questions = form.watch('questions');
  const _levels = useLevelsOfDifficulty();

  const datas = React.useMemo(() => {
    const categories = [];
    const levels = [];
    forEach(test.questions, (question) => {
      if (!includes(categories, question.category)) {
        categories.push(question.category);
      }
      if (!includes(levels, question.level)) {
        levels.push(question.level);
      }
    });

    return {
      categories: map(
        filter(test.questionBank.categories, (category) => includes(categories, category.id)),
        ({ value, id }) => ({ label: value, value: id })
      ),
      levels: filter(_levels, (level) => includes(levels, level.value)),
    };
  }, [test, _levels]);

  function getQuestionsApplyingFilters() {
    const f = form.getValues();
    const q = filter(test.questions, (question) => {
      if (!f || f.useAllQuestions) {
        return true;
      }
      let good = true;
      if (f.level && f.level.length > 0) {
        if (!f.level.includes(question.level)) {
          good = false;
        }
      }
      if (f.categories && f.categories.length > 0) {
        if (!f.categories.includes(question.category)) {
          good = false;
        }
      }
      return good;
    });
    return q;
  }

  function recalculeQuestions() {
    form.setValue('questions', getQuestionsApplyingFilters());
  }

  React.useEffect(() => {
    recalculeQuestions();
  }, []);

  React.useEffect(() => {
    const subscription = form.watch((data, { name }) => {
      if (name !== 'questions') recalculeQuestions();
    });

    return () => subscription.unsubscribe();
  });

  return (
    <ContextContainer divided>
      <ContextContainer>
        <Title order={3}>{t('configTitle')}</Title>
        <Text>{t('configDescription')}</Text>
        <Text size="md">
          {t('totalQuestions', { n: test.questions.length })}
          {useAllQuestions || (!useAllQuestions && nQuestions) ? (
            <span
              dangerouslySetInnerHTML={{
                __html: ` (${t('requirementsQuestions', {
                  n: `<span style="color: ${
                    // eslint-disable-next-line no-nested-ternary
                    useAllQuestions
                      ? COLORS.fatic02
                      : questions.length < nQuestions
                      ? COLORS.fatic01
                      : COLORS.fatic02
                  }">${questions?.length}</span>`,
                })})`,
              }}
            />
          ) : null}
        </Text>

        <Box>
          <InputWrapper
            label={t('nOfQuestions')}
            description={
              <Controller
                control={form.control}
                name="useAllQuestions"
                render={({ field }) => (
                  <Checkbox {...field} label={t('useAllQuestions')} checked={field.value} />
                )}
              />
            }
          >
            {!useAllQuestions ? (
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
                  validate: () => {
                    if (nQuestions > questions.length) {
                      return t('noRequiredQuestions');
                    }
                    return true;
                  },
                }}
                render={({ field }) => (
                  <NumberInput required error={form.formState.errors.nQuestions} {...field} />
                )}
              />
            ) : null}
          </InputWrapper>
        </Box>
        {!useAllQuestions
          ? [
              datas.categories.length > 0 ? (
                <Box key={2}>
                  <Controller
                    control={form.control}
                    name="categories"
                    shouldUnregister
                    render={({ field }) => (
                      <MultiSelect
                        placeholder={t('all')}
                        label={t('categoriesLabel')}
                        data={datas.categories}
                        {...field}
                      />
                    )}
                  />
                </Box>
              ) : null,
              <Box key={3}>
                <Controller
                  control={form.control}
                  name="level"
                  shouldUnregister
                  render={({ field }) => (
                    <MultiSelect
                      placeholder={t('all')}
                      label={t('levelLabel')}
                      data={datas.levels}
                      {...field}
                    />
                  )}
                />
              </Box>,
            ]
          : null}
      </ContextContainer>
      <Stack fullWidth justifyContent="space-between">
        <Box>
          <Button
            compact
            variant="light"
            leftIcon={<ChevLeftIcon height={20} width={20} />}
            onClick={() => {
              const values = form.getValues();
              const { questions: q, ...filters } = values;
              onBack({
                questions: map(q, 'id'),
                filters,
              });
            }}
          >
            {t('prev')}
          </Button>
        </Box>
        <Box>
          <Button
            onClick={() => {
              form.handleSubmit(({ questions: q, ...filters }) => {
                let qs = q;
                if (!useAllQuestions) {
                  qs = q.slice(0, nQuestions);
                }
                onSend({
                  questions: map(qs, 'id'),
                  filters,
                });
              })();
            }}
          >
            {t('assign')}
          </Button>
        </Box>
      </Stack>
    </ContextContainer>
  );
}

AssignConfig.propTypes = {
  test: PropTypes.object,
  t: PropTypes.func,
  onBack: PropTypes.func,
  onSend: PropTypes.func,
  defaultValues: PropTypes.any,
};
