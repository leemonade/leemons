import { cloneElement, useEffect, useMemo, useState } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';

import SelectLevelsOfDifficulty from '@assignables/components/LevelsOfDifficulty/SelectLevelsOfDifficulty';
import {
  Box,
  Button,
  ContextContainer,
  Select,
  Stack,
  Switch,
  Text,
  Textarea,
  TotalLayoutFooterContainer,
  TotalLayoutStepContainer,
} from '@bubbles-ui/components';
import { TextEditorInput, TEXT_EDITOR_TEXTAREA_TOOLBARS } from '@bubbles-ui/editors';
import { ChevLeftIcon } from '@bubbles-ui/icons/outline';
import { ViewOffIcon } from '@bubbles-ui/icons/solid';
import { isEmpty, map } from 'lodash';
import PropTypes from 'prop-types';

import {
  QUESTION_TYPES,
  SOLUTION_KEY_BY_TYPE,
  QUESTION_TYPES_WITH_HIDDEN_ANSWERS,
  QUESTION_TYPES_WITH_MIN_RESPONSES_TO_ADD_CLUES,
} from '../questionConstants';

import CategoryPicker from './CategoryPicker';
import { MapQuestion } from './question-types/Map';
import { MonoResponse } from './question-types/MonoResponse';
import { OpenResponse } from './question-types/OpenResponse';
import { ShortResponse } from './question-types/ShortResponse';
import { TrueFalse } from './question-types/TrueFalse';

import { QuestionTypeSelect } from '@tests/components/QuestionTypeSelect';
import ResourcePicker from '@tests/components/ResourcePicker';

const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const questionComponents = {
  [QUESTION_TYPES.MONO_RESPONSE]: <MonoResponse />,
  [QUESTION_TYPES.MAP]: <MapQuestion />,
  [QUESTION_TYPES.TRUE_FALSE]: <TrueFalse />,
  [QUESTION_TYPES.SHORT_RESPONSE]: <ShortResponse />,
  [QUESTION_TYPES.OPEN_RESPONSE]: <OpenResponse />,
};

export default function DetailQuestionForm({
  t,
  stepName,
  scrollRef,
  isPublished,
  savingAs,
  onSave,
  onSaveQuestion,
  defaultValues,
  categories,
  onCategoriesChange,
  onCancel,
}) {
  const [withStemResource, setWithStemResource] = useState(!!defaultValues?.stemResource);

  const form = useForm({
    defaultValues: { ...defaultValues, clues: defaultValues?.clues || [] },
    shouldUnregister: true,
  });
  const choices = form.watch('choices');
  const mapProperties = form.watch('mapProperties');
  const trueFalseProperties = form.watch('trueFalseProperties');
  const type = form.watch('type');
  const hasHelp = form.watch('hasHelp');

  const rightAnswerSelected = useMemo(() => {
    if (type === QUESTION_TYPES.MAP) return true;
    if (type === QUESTION_TYPES.MONO_RESPONSE) {
      return choices?.some((item) => item?.isCorrect);
    }
    if (type === QUESTION_TYPES.TRUE_FALSE) {
      return typeof trueFalseProperties?.isTrue === 'boolean';
    }

    return type === QUESTION_TYPES.SHORT_RESPONSE || type === QUESTION_TYPES.OPEN_RESPONSE;
  }, [type, choices, trueFalseProperties?.isTrue]);

  const solutionValues = form.watch(SOLUTION_KEY_BY_TYPE[type]);
  const answersArray = useMemo(() => {
    if (!type || type === QUESTION_TYPES.TRUE_FALSE || type === QUESTION_TYPES.OPEN_RESPONSE)
      return [];
    return solutionValues ?? [];
  }, [type, solutionValues]);

  // HANDLERS ·······························································································|

  async function handleOnSaveQuestion() {
    form.handleSubmit((data) => {
      if (defaultValues?.id) {
        data = { ...defaultValues, ...data };
      }
      onSaveQuestion(data);
    })();
  }

  function handleOnSave() {
    form.handleSubmit((data) => {
      onSave(data);
    })();
  }

  function handleHideOnHelp(index) {
    const data = [...answersArray];

    if (index && !isEmpty(data)) {
      // loop through responses and set hideOnHelp to true only on index
      for (let i = 0; i < data.length; i++) {
        data[i].hideOnHelp = i === Number(index);
      }
      form.setValue(SOLUTION_KEY_BY_TYPE[type], data);
    }
  }

  const QuestionComponent = useMemo(() => {
    if (!type) return null;

    return cloneElement(questionComponents[type], {
      form,
      t,
      scrollRef,
    });
  }, [type, form, t, scrollRef]);

  // HIDE ON HELP CONFIG ·················································································|

  const hideAnswersSelectData = useMemo(() => {
    if (isEmpty(answersArray)) return [];

    let useLetters = true;
    if (type === QUESTION_TYPES.MAP && mapProperties?.markers.type === 'numbering') {
      useLetters = false;
    }

    return map(answersArray, (item, index) => ({
      value: index,
      label: useLetters ? LETTERS[index] : `${index + 1}`,
      disabled: type === QUESTION_TYPES.MAP ? item?.hideOnHelp : item?.isCorrect,
    }));
  }, [
    JSON.stringify(choices),
    JSON.stringify(mapProperties),
    type,
    answersArray,
    mapProperties?.markers.type,
  ]);

  const hasEnoughAnswersToAddClues = useMemo(() => {
    if (!QUESTION_TYPES_WITH_MIN_RESPONSES_TO_ADD_CLUES.includes(type)) {
      return true;
    }
    return answersArray?.length >= 3;
  }, [type, answersArray]);

  const hideOptionsHelp = useMemo(() => {
    if (!rightAnswerSelected) return t('hideOptionNoRightAnswer');

    const parts = t('hideOptionsHelp').split('{{icon}}');
    return [
      parts[0],
      <Box
        key={2}
        sx={(theme) => ({
          display: 'inline',
          fontSize: theme.fontSizes[3],
          verticalAlign: 'middle',
        })}
      >
        <ViewOffIcon />
      </Box>,
      parts[1],
    ];
  }, [t, rightAnswerSelected]);

  const hiddenAnswer = useMemo(
    () =>
      answersArray
        .map((item, index) => (item?.hideOnHelp ? index : -1))
        .filter((item) => item >= 0)[0],
    [answersArray]
  );

  // EFFECTS ·······························································································|
  useEffect(() => {
    // Reset rules when type changes
    return () => {
      form.unregister(['globalFeedback']);
    };
  }, [type]);

  return (
    <FormProvider {...form}>
      <TotalLayoutStepContainer
        stepName={stepName}
        Footer={
          <TotalLayoutFooterContainer
            fixed
            scrollRef={scrollRef}
            leftZone={
              <Button
                variant="outline"
                leftIcon={<ChevLeftIcon height={20} width={20} />}
                onClick={onCancel}
              >
                {t('returnToList')}
              </Button>
            }
            rightZone={
              <>
                {!isPublished ? (
                  <Button
                    variant="link"
                    onClick={handleOnSave}
                    disabled={savingAs || !type}
                    loading={savingAs === 'draft'}
                  >
                    {t('saveDraft')}
                  </Button>
                ) : null}
                <Button disabled={!type} onClick={handleOnSaveQuestion}>
                  {t('saveQuestion')}
                </Button>
              </>
            }
          />
        }
      >
        <Box style={{ marginBottom: 42 }}>
          <ContextContainer title={t('questionDetail')} spacing={4}>
            <Box>
              <ContextContainer fullWidth direction="row">
                <Controller
                  control={form.control}
                  name="type"
                  rules={{ required: t('typeRequired') }}
                  render={({ field }) => (
                    <QuestionTypeSelect required error={form.formState.errors.type} {...field} />
                  )}
                />
                {type ? (
                  <Controller
                    control={form.control}
                    name="level"
                    render={({ field }) => (
                      <SelectLevelsOfDifficulty
                        error={form.formState.errors.level}
                        label={t('levelLabel')}
                        placeholder={t('levelPlaceholder')}
                        {...field}
                      />
                    )}
                  />
                ) : null}
              </ContextContainer>
            </Box>
            {type && (
              <>
                <CategoryPicker
                  t={t}
                  categoriesData={categories}
                  control={form.control}
                  form={form}
                  onCategoriesChange={onCategoriesChange}
                />
                {/*
                <Controller
                  control={form.control}
                  name="tags"
                  render={({ field }) => (
                    <Box style={{ width: '484px' }}>
                      <TagsAutocomplete
                        {...field}
                        pluginName="tests"
                        type="tests.questionBanks"
                        label={t('tagsLabel')}
                        labels={{ addButton: t('addTag') }}
                      />
                    </Box>
                  )}
                />
                */}
                <Controller
                  control={form.control}
                  name="stem"
                  rules={{
                    required: t('questionRequired'),
                  }}
                  render={({ field }) => (
                    <TextEditorInput
                      required
                      toolbars={TEXT_EDITOR_TEXTAREA_TOOLBARS}
                      error={form.formState.errors.stem}
                      label={t('questionLabel')}
                      editorStyles={{ minHeight: '96px' }}
                      placeholder={t('statementPlaceHolder')}
                      {...field}
                      value={field.value?.text}
                      onChange={(value) => {
                        field.onChange({ text: value, format: 'html' });
                      }}
                    />
                  )}
                />

                {type !== QUESTION_TYPES.MAP && (
                  <ContextContainer spacing={4}>
                    <Switch
                      checked={withStemResource}
                      onChange={(value) => {
                        if (!value) {
                          form.setValue('stemResource', null);
                        }
                        setWithStemResource(value);
                      }}
                      label={t('stemResourceLabel')}
                      description={t('stemResourceDescription')}
                    />
                    {withStemResource && (
                      <Controller
                        control={form.control}
                        name="stemResource"
                        render={({ field }) => <ResourcePicker {...field} />}
                      />
                    )}
                  </ContextContainer>
                )}

                {QuestionComponent}
                {/* CLUES ---------------------------------------- */}
                {hasHelp ? (
                  <ContextContainer
                    title={
                      QUESTION_TYPES_WITH_MIN_RESPONSES_TO_ADD_CLUES.includes(type)
                        ? t('hasCluesLabelWithMinResponses')
                        : t('hasCluesLabel')
                    }
                    description={t('cluesDescription')}
                  >
                    <Controller
                      control={form.control}
                      name="clues[0]"
                      render={({ field }) => (
                        <Textarea
                          {...field}
                          disabled={!rightAnswerSelected || !hasEnoughAnswersToAddClues}
                          minRows={3}
                          placeholder={t('cluesPlaceholder')}
                        />
                      )}
                    />
                    {QUESTION_TYPES_WITH_HIDDEN_ANSWERS?.includes(type) && (
                      <Stack direction="column" spacing={2}>
                        <Box style={{ width: 200 }}>
                          <Select
                            label={t('hideOptionsLabel')}
                            value={hiddenAnswer}
                            data={hideAnswersSelectData}
                            disabled={!rightAnswerSelected || !hasEnoughAnswersToAddClues}
                            onChange={handleHideOnHelp}
                            placeholder={t('hideOptionsPlaceholder')}
                          />
                        </Box>
                        <Text size="xs">{hideOptionsHelp}</Text>
                      </Stack>
                    )}
                  </ContextContainer>
                ) : null}
              </>
            )}
          </ContextContainer>
        </Box>
      </TotalLayoutStepContainer>
    </FormProvider>
  );
}

DetailQuestionForm.propTypes = {
  onSave: PropTypes.func,
  defaultValues: PropTypes.object,
  t: PropTypes.func.isRequired,
  onCancel: PropTypes.func,
  categories: PropTypes.array,
  savingAs: PropTypes.string,
  onSaveQuestion: PropTypes.func,
  stepName: PropTypes.string,
  scrollRef: PropTypes.object,
  isPublished: PropTypes.bool,
  onCategoriesChange: PropTypes.func,
};
