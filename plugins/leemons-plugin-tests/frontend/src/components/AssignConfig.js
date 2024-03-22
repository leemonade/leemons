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
  Chip,
  TableInput,
  Text,
  TextInput,
  Title,
  TotalLayoutFooterContainer,
  TotalLayoutStepContainer,
  createStyles,
  RadioGroup,
} from '@bubbles-ui/components';
import { ChevLeftIcon } from '@bubbles-ui/icons/outline';
import { filter, forEach, includes, isArray, isFunction, map, omit } from 'lodash';
import useLevelsOfDifficulty from '@assignables/components/LevelsOfDifficulty/hooks/useLevelsOfDifficulty';
import { Controller, FormProvider, useForm, useWatch } from 'react-hook-form';
import Preview from '@assignables/components/Assignment/components/Preview/Preview';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import prefixPN from '@tests/helpers/prefixPN';
import { RandomQuestionsGenerator } from '@tests/pages/private/tests/components/RandomQuestionsGenerator';
import QuestionsTable from '@tests/pages/private/tests/components/QuestionsTable';
import { FilteredQuestionsGenerator } from '@tests/pages/private/tests/components/FilteredQuestionsGenerator';
import { ManualQuestionsGenerator } from '@tests/pages/private/tests/components/ManualQuestionsGenerator';

const AssignConfigStyles = createStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'row',
    gap: theme.other.global.spacing.gap.xlg, // 24
    zIndex: 0,
    paddingBottom: 10,
  },
  leftColumn: {
    width: 928 - 266 - 24 * 2, // leftColumn + rightColumn
    '@media (min-width: 1920px)': {
      width: 1400 - 266 - 24 * 2,
    },
  },
  rightColumn: {
    minWidth: 266,
    height: 480,
  },
  totalQuestions: {
    width: 'fit-content',
  },
  listElements: {
    listStyleType: 'disc',
    marginLeft: theme.spacing.md,
    paddingTop: 12,
  },
  radioGroupContainer: {
    marginLeft: 24,
  },
  counterContainer: {
    display: 'flex',
    justifyContent: 'flex-start',
    gap: 8,
  },
  selectedCounter: {
    color: theme.other.chip.content.color.default,
    backgroundColor: theme.other.core.color.neutral['100'],
    borderRadius: 4,
    display: 'block',
    width: 'fit-content',
    padding: 10,
    ...theme.other.global.content.typo.heading.xsm,
    marginTop: 24,
    marginBottom: 8,
  },
}));

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
  loading,
  configs = [],
  onSave,
  onPrevStep,
  onSend,
  onChange,
  hideButtons,
  assignable,
  data,
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
  const [t2] = useTranslateLoader(prefixPN('testsEdit'));
  const [radioSelection, setRadioSelection] = React.useState(null);
  const [randomQuestions, setRandomQuestions] = React.useState([]);
  const [filteredQuestions, setFilteredQuestions] = React.useState([]);
  const [manualQuestions, setManualQuestions] = React.useState([]);
  const { classes } = AssignConfigStyles();
  const form = useForm({ defaultValues });
  const previewForm = useForm({ defaultValues: data });
  const useAllQuestions = form.watch('useAllQuestions');
  const nQuestions = form.watch('nQuestions');
  // const questions = form.watch('questions');
  const settings = form.watch('settings');
  const settingsAsPreset = form.watch('settingsAsPreset');
  const useAdvancedSettings = form.watch('useAdvancedSettings');
  const canOmitQuestions = form.watch('canOmitQuestions');
  const allowClues = form.watch('allowClues');
  const clues = form.watch('clues');
  const filtersValue = 'filters.nQuestions';
  const nQuestionsSelector = form.watch(filtersValue);
  // console.log('formValues', form.watch());

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

  React.useEffect(() => {
    if (useAllQuestions) {
      form.setValue(
        'questions',
        test.questions.map((q) => q.id)
      );
    }
  }, [useAllQuestions]);

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

  const customOptions = React.useMemo(
    () => [
      {
        value: 'randomQuestions',
        help: t2('randomQuestions'),
      },
      {
        value: 'filteredQuestions',
        help: t2('filteredQuestions'),
      },
      {
        value: 'manualQuestions',
        help: t2('manualQuestions'),
      },
    ],
    [t2]
  );

  const advancedConfigOptions = React.useMemo(
    () => [
      {
        value: 'new',
        label: t('newConfig'),
      },
      {
        value: 'existing',
        label: t('existingConfig'),
      },
    ],
    [t]
  );

  const generateQuestions = () => {
    const totalQuestions = test?.questions;
    const questionsToSelect = nQuestionsSelector ?? totalQuestions.length;
    const selectedQuestions = [];
    while (selectedQuestions.length < questionsToSelect) {
      const randomIndex = Math.floor(Math.random() * totalQuestions.length);
      const question = totalQuestions[randomIndex];
      if (!selectedQuestions.map((q) => q?.id).includes(question?.id)) {
        selectedQuestions.push(question);
      }
    }
    const selectedQuestionIds = selectedQuestions.map((question) => question.id);
    form.setValue('questions', selectedQuestionIds);
    setRandomQuestions(selectedQuestions);
    form.setValue('config.randomQuestions.selectedQuestions', [...selectedQuestionIds]);
  };

  const randomQuestionsActive = radioSelection === 'randomQuestions' ? randomQuestions : null;
  const filteredQuestionsActive = radioSelection === 'filteredQuestions' ? filteredQuestions : null;

  return (
    <TotalLayoutStepContainer
      fullWidth={hideButtons}
      clean={hideButtons}
      noMargin={hideButtons}
      Footer={
        !hideButtons && (
          <TotalLayoutFooterContainer
            fixed
            leftZone={
              <Button
                compact
                variant="outline"
                leftIcon={<ChevLeftIcon height={20} width={20} />}
                onClick={() => {
                  const values = form.getValues();
                  const { questions: q, ...filters } = values;
                  onSave({
                    questions: map(q, 'id'),
                    filters,
                  });
                  onPrevStep();
                }}
              >
                {t('prev')}
              </Button>
            }
            rightZone={
              <Button
                loading={loading}
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
            }
          />
        )
      }
    >
      <Box className={classes.root}>
        <Box className={classes.leftColumn}>
          <ContextContainer divided>
            <ContextContainer>
              <Title order={3}>{t('configTitle')}</Title>
              <Box className={classes.totalQuestions}>
                <Chip subject={t('totalQuestions', { n: test.questions.length })} />
              </Box>
              <Box>
                <InputWrapper
                  description={
                    <Controller
                      control={form.control}
                      name="useAllQuestions"
                      render={({ field }) => (
                        <Switch
                          {...field}
                          label={t('customQuestionSelection')}
                          checked={field.value}
                          onChange={() => {
                            form.setValue('useAllQuestions', !field.value);
                          }}
                        />
                      )}
                    />
                  }
                >
                  {useAllQuestions && (
                    <Box>
                      <Box className={classes.radioGroupContainer}>
                        <Controller
                          control={form.control}
                          name="customChoices"
                          render={({ field }) => (
                            <RadioGroup
                              {...field}
                              value={radioSelection}
                              label={t2('customChoicesLabel')}
                              className={classes.radioGroup}
                              placeholder={t2('customChoicesPlaceholder')}
                              data={customOptions}
                              onChange={(option) => {
                                form.setValue('config.customChoice', option);
                                return setRadioSelection(option);
                              }}
                            />
                          )}
                        />
                        {radioSelection === 'randomQuestions' && (
                          <RandomQuestionsGenerator
                            t={t2}
                            form={form}
                            nQuestions={test?.questions?.length || 0}
                            classes={classes}
                            generateQuestions={generateQuestions}
                          />
                        )}
                        {radioSelection === 'filteredQuestions' && (
                          <FilteredQuestionsGenerator
                            t={t2}
                            form={form}
                            questionBank={test.questionBank}
                            assignmentQuestions={test?.questions || []}
                            classes={classes}
                            assignmentMode
                            filteredQuestions={filteredQuestions}
                            setFilteredQuestions={setFilteredQuestions}
                            isNewTest={false}
                          />
                        )}
                        {radioSelection === 'manualQuestions' && (
                          <ManualQuestionsGenerator
                            t={t2}
                            form={form}
                            questionBank={test.questionBank}
                            assignmentMode
                            assignmentQuestions={test?.questions || []}
                            manualQuestions={manualQuestions}
                            setManualQuestions={setManualQuestions}
                          />
                        )}
                        {(radioSelection === 'randomQuestions' && randomQuestions.length > 0) ||
                        (radioSelection === 'filteredQuestions' && filteredQuestions.length > 0) ? (
                          <Controller
                            control={form.control}
                            name="questions"
                            render={({ field }) => (
                              <QuestionsTable
                                questions={randomQuestionsActive ?? filteredQuestionsActive ?? []}
                                forceSortable
                                value={field.value}
                                onChange={(e) => field.onChange(e)}
                                questionBank={test.questionBank}
                                reorderMode={true}
                                hideCheckbox
                                hideOpenIcon
                              />
                            )}
                          />
                        ) : null}
                      </Box>
                    </Box>
                  )}
                  {/* {useAllQuestions ? (
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
                  ) : null} */}
                </InputWrapper>
              </Box>
              {/* {useAllQuestions
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
                : null} */}

              <Title order={4}>{t('executionRules')}</Title>
              <Alert
                variant="block"
                severity="warning"
                title={t('defaultRules.alert')}
                closeable={false}
              >
                <Text>{t('defaultRules.title')}</Text>
                <ul className={classes.listElements}>
                  <li> {t('defaultRules.canOmit')}</li>
                  <li> {t('defaultRules.errorQuestions')}</li>
                  <li> {t('defaultRules.canClue')}</li>
                </ul>
                {/* {t('defaultRules.useAdvanced')} */}
              </Alert>
              <Controller
                control={form.control}
                name="useAdvancedSettings"
                shouldUnregister
                render={({ field }) => (
                  <Switch checked={field.value} {...field} label={t('allowAdvancedSettings')} />
                )}
              />
              {useAdvancedSettings ? (
                <Box>
                  <ContextContainer>
                    <Controller
                      control={form.control}
                      name="settings"
                      shouldUnregister
                      render={({ field }) => {
                        <RadioGroup
                          {...field}
                          value={radioSelection}
                          label={t2('customChoicesLabel')}
                          className={classes.radioGroup}
                          placeholder={t2('customChoicesPlaceholder')}
                          data={customOptions}
                        />;
                      }}
                    />
                    <Controller
                      control={form.control}
                      name="settings"
                      shouldUnregister
                      render={({ field }) => (
                        <RadioGroup
                          // data={[
                          //   { label: t('new'), value: 'new' },
                          //   ...map(configs, (config) => ({ value: config.id, label: config.name })),
                          // ]}
                          data={advancedConfigOptions}
                          {...field}
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
                            <Switch
                              checked={field.value}
                              {...field}
                              label={t('settingsAsPreset')}
                            />
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
                                    {
                                      label: t('wrongAnswerPercentage', { number: 25 }),
                                      value: 25,
                                    },
                                    {
                                      label: t('wrongAnswerPercentage', { number: 50 }),
                                      value: 50,
                                    },
                                    {
                                      label: t('wrongAnswerPercentage', { number: 100 }),
                                      value: 100,
                                    },
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
                </Box>
              ) : null}
            </ContextContainer>
          </ContextContainer>
        </Box>
        <Box className={classes.rightColumn}>
          <FormProvider {...previewForm}>
            <Preview assignable={assignable} localizations={{ preview: { title: t('preview') } }} />
          </FormProvider>
        </Box>
      </Box>
    </TotalLayoutStepContainer>
  );
}

AssignConfig.propTypes = {
  loading: PropTypes.bool,
  test: PropTypes.object,
  t: PropTypes.func,
  onBack: PropTypes.func,
  onSend: PropTypes.func,
  onChange: PropTypes.func,
  configs: PropTypes.any,
  defaultValues: PropTypes.any,
  hideButtons: PropTypes.bool,
  onSave: PropTypes.func,
  onPrevStep: PropTypes.func,
  assignable: PropTypes.object,
  data: PropTypes.object,
};
