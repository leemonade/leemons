import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Button,
  ContextContainer,
  InputWrapper,
  Switch,
  Chip,
  Title,
  TotalLayoutFooterContainer,
  TotalLayoutStepContainer,
  createStyles,
  RadioGroup,
} from '@bubbles-ui/components';
import { ChevLeftIcon, ChevRightIcon } from '@bubbles-ui/icons/outline';
import { isArray, isFunction, map, omit } from 'lodash';
import { Controller, useForm, useWatch } from 'react-hook-form';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import prefixPN from '@tests/helpers/prefixPN';
import { RandomQuestionsGenerator } from '@tests/pages/private/tests/components/RandomQuestionsGenerator';
import QuestionsTable from '@tests/pages/private/tests/components/QuestionsTable';
import { FilteredQuestionsGenerator } from '@tests/pages/private/tests/components/FilteredQuestionsGenerator';
import { ManualQuestionsGenerator } from '@tests/pages/private/tests/components/ManualQuestionsGenerator';

const AssignConfigStyles = createStyles((theme, { isDrawer }) => ({
  root: {
    display: 'flex',
    flexDirection: 'row',
    gap: theme.other.global.spacing.gap.xlg, // 24
    zIndex: 0,
    paddingBottom: 10,
    maxWidth: isDrawer ? '660px' : '100%',
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
  advancedInputs: {
    width: 'fit-content',
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
        questions: usedQuestions,
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
  onSave,
  onPrevStep,
  onChange,
  hideButtons,
  onNextStep,
  isDrawer,
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
  const { classes } = AssignConfigStyles({ isDrawer });
  const form = useForm({ defaultValues });
  const useAllQuestions = form.watch('useAllQuestions');
  const filtersValue = 'filters.nQuestions';
  const nQuestionsSelector = form.watch(filtersValue);

  useOnChange({ onChange, control: form.control });

  React.useEffect(() => {
    if (typeof onSave === 'function') {
      onSave({
        questions: test.questions.map((q) => q.id),
      });
    }
    form.setValue(
      'questions',
      test.questions.map((q) => q.id)
    );
  }, [test]);

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
                    questions: q,
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
                rightIcon={<ChevRightIcon height={20} width={20} />}
                onClick={() => {
                  const values = form.getValues();
                  const { questions: q, ...filters } = values;
                  onSave({
                    questions: q,
                    filters,
                  });
                  onNextStep();
                }}
              >
                {t('next')}
              </Button>
            }
          />
        )
      }
    >
      <Box className={classes.root}>
        <Box>
          <ContextContainer divided>
            <ContextContainer>
              <Title order={isDrawer ? 4 : 3}>{t('configTitle')}</Title>
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
                            isDrawer={isDrawer}
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
                                isDrawer={isDrawer}
                              />
                            )}
                          />
                        ) : null}
                      </Box>
                    </Box>
                  )}
                </InputWrapper>
              </Box>
            </ContextContainer>
          </ContextContainer>
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
  onNextStep: PropTypes.func,
  isDrawer: PropTypes.bool,
};
