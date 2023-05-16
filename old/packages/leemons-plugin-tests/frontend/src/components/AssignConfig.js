import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Alert,
  Box,
  Button,
  Checkbox,
  COLORS,
  ContextContainer,
  InputWrapper,
  MultiSelect,
  NumberInput,
  Paper,
  Select,
  Stack,
  Switch,
  TableInput,
  Text,
  TextInput,
  Title,
} from '@bubbles-ui/components';
import { ChevLeftIcon } from '@bubbles-ui/icons/outline';
import { filter, forEach, includes, isArray, isFunction, map, omit } from 'lodash';
import useLevelsOfDifficulty from '@assignables/components/LevelsOfDifficulty/hooks/useLevelsOfDifficulty';
import { Controller, useForm, useWatch } from 'react-hook-form';

function useOnChange({ onChange, control }) {
  const formValues = useWatch({
    control,
    disabled: !isFunction(onChange),
  });

  useEffect(() => {
    if (isFunction(onChange)) {
      const { questions, useAllQuestions, nQuestions } = formValues;
      let usedQuestions = [];

      if (isArray(questions)) {
        usedQuestions = useAllQuestions ? questions : questions.slice(0, nQuestions);
      }

      onChange({
        questions: map(usedQuestions, 'id'),
        filters: omit(formValues, 'questions'),
      });
    }
  }, [formValues]);
}

export default function AssignConfig({
  defaultValues: dv,
  test,
  t,
  configs = [],
  onBack,
  onSend,
  onChange,
  hideButtons,
}) {
  let defaultValues = {
    clues: [
      { type: 'note', name: t('clueExtraInfo'), value: 0, canUse: true },
      { type: 'hide-response', name: t('clueHideOption'), value: 0, canUse: true },
    ],
  };
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
  const settings = form.watch('settings');
  const settingsAsPreset = form.watch('settingsAsPreset');
  const useAdvancedSettings = form.watch('useAdvancedSettings');
  const canOmitQuestions = form.watch('canOmitQuestions');
  const allowClues = form.watch('allowClues');
  const clues = form.watch('clues');

  useOnChange({ onChange, control: form.control });

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

  const cluesData = map(clues, (clue, index) => ({
    ...clue,
    canUseCheck: (
      <Checkbox
        checked={clue.canUse}
        onChange={(e) => {
          const _clues = form.getValues('clues');
          _clues[index].canUse = e;
          form.setValue('clues', _clues);
        }}
      />
    ),
    select: (
      <Select
        data={[
          { label: t('clueNoImpact'), value: 0 },
          { label: t('cluePer', { number: 25 }), value: 25 },
          { label: t('cluePer', { number: 50 }), value: 50 },
        ]}
        value={clue.value}
        onChange={(e) => {
          const _clues = form.getValues('clues');
          forEach(_clues, (v, i) => {
            _clues[i].value = e;
          });
          form.setValue('clues', _clues);
        }}
      />
    ),
  }));

  return (
    <ContextContainer divided>
      <ContextContainer>
        <Title order={3}>{t('configTitle')}</Title>

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

        <Text>{t('configDescription')}</Text>

        <Box>
          <InputWrapper
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
                  <NumberInput
                    label={t('nOfQuestions')}
                    required
                    error={form.formState.errors.nQuestions}
                    {...field}
                  />
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

        <Alert variant="block" title={t('defaultRules.title')} closeable={false}>
          <ul>
            <li>- {t('defaultRules.canOmit')}</li>
            <li>- {t('defaultRules.errorQuestions')}</li>
            <li>- {t('defaultRules.canClue')}</li>
          </ul>
          <br />
          {t('defaultRules.useAdvanced')}
        </Alert>

        <Title order={4}>{t('advancedSettings')}</Title>
        <Controller
          control={form.control}
          name="useAdvancedSettings"
          shouldUnregister
          render={({ field }) => (
            <Switch checked={field.value} {...field} label={t('allowAdvancedSettings')} />
          )}
        />

        {useAdvancedSettings ? (
          <Paper>
            <ContextContainer>
              <Controller
                control={form.control}
                name="settings"
                shouldUnregister
                render={({ field }) => (
                  <Select
                    data={[
                      { label: t('new'), value: 'new' },
                      ...map(configs, (config) => ({ value: config.id, label: config.name })),
                    ]}
                    {...field}
                    label={t('useSettings')}
                  />
                )}
              />

              {settings === 'new' ? (
                <>
                  <Controller
                    control={form.control}
                    name="settingsAsPreset"
                    shouldUnregister
                    render={({ field }) => (
                      <Switch checked={field.value} {...field} label={t('settingsAsPreset')} />
                    )}
                  />
                  {settingsAsPreset ? (
                    <Controller
                      control={form.control}
                      name="presetName"
                      shouldUnregister
                      render={({ field }) => (
                        <TextInput checked={field.value} {...field} label={t('presetName')} />
                      )}
                    />
                  ) : null}
                  <Controller
                    control={form.control}
                    name="wrong"
                    shouldUnregister
                    render={({ field }) => (
                      <Select
                        description={t('wrongAnswerDescription')}
                        data={[
                          { label: t('wrongAnswerDoNotScore'), value: 0 },
                          { label: t('wrongAnswerPercentage', { number: 25 }), value: 25 },
                          { label: t('wrongAnswerPercentage', { number: 50 }), value: 50 },
                          { label: t('wrongAnswerPercentage', { number: 100 }), value: 100 },
                        ]}
                        {...field}
                        label={t('wrongAnswerLabel')}
                      />
                    )}
                  />
                  <InputWrapper
                    label={t('unansweredLabel')}
                    description={
                      <Controller
                        control={form.control}
                        name="canOmitQuestions"
                        shouldUnregister
                        render={({ field }) => (
                          <Switch
                            checked={field.value}
                            {...field}
                            label={t('unansweredDescriptions')}
                          />
                        )}
                      />
                    }
                  >
                    {canOmitQuestions ? (
                      <Controller
                        control={form.control}
                        name="omit"
                        shouldUnregister
                        render={({ field }) => (
                          <Select
                            description={t('unansweredDescription2')}
                            data={[
                              { label: t('wrongAnswerDoNotScore'), value: 0 },
                              { label: t('wrongAnswerPercentage', { number: 25 }), value: 25 },
                              { label: t('wrongAnswerPercentage', { number: 50 }), value: 50 },
                              { label: t('wrongAnswerPercentage', { number: 100 }), value: 100 },
                            ]}
                            {...field}
                          />
                        )}
                      />
                    ) : null}
                  </InputWrapper>

                  <InputWrapper
                    label={t('clues')}
                    description={
                      <Controller
                        control={form.control}
                        name="allowClues"
                        shouldUnregister
                        render={({ field }) => (
                          <Switch checked={field.value} {...field} label={t('allowClues')} />
                        )}
                      />
                    }
                  >
                    {allowClues ? (
                      <Controller
                        control={form.control}
                        name="clues"
                        shouldUnregister
                        render={({ field }) => (
                          <TableInput
                            forceSortable={true}
                            disabled={true}
                            columns={[
                              {
                                Header: t('clueCanUse'),
                                accessor: 'canUseCheck',
                              },
                              {
                                Header: t('clueType'),
                                accessor: 'name',
                              },
                              {
                                Header: t('clueReduction'),
                                accessor: 'select',
                              },
                            ]}
                            {...field}
                            data={cluesData}
                            labels={{}}
                          />
                        )}
                      />
                    ) : null}
                  </InputWrapper>
                </>
              ) : null}
            </ContextContainer>
          </Paper>
        ) : null}
      </ContextContainer>
      {!hideButtons && (
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
      )}
    </ContextContainer>
  );
}

AssignConfig.propTypes = {
  test: PropTypes.object,
  t: PropTypes.func,
  onBack: PropTypes.func,
  onSend: PropTypes.func,
  onChange: PropTypes.func,
  configs: PropTypes.any,
  defaultValues: PropTypes.any,
  hideButtons: PropTypes.bool,
};
