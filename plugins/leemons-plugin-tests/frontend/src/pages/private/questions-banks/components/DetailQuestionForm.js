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
import ImagePicker from '@leebrary/components/ImagePicker';
import { isEmpty, map } from 'lodash';
import PropTypes from 'prop-types';

import {
  QUESTION_TYPES,
  SOLUTION_KEY_BY_TYPE,
  QUESTION_TYPES_WITH_HIDDEN_ANSWERS,
  getQuestionTypesForSelect,
  QUESTION_TYPES_WITH_MIN_RESPONSES_TO_ADD_CLUES,
} from '../questionConstants';

import { MapQuestion } from './question-types/Map';
import { MonoResponse } from './question-types/MonoResponse';
import { ShortResponse } from './question-types/ShortResponse';

const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const questionComponents = {
  [QUESTION_TYPES.MONO_RESPONSE]: <MonoResponse />,
  [QUESTION_TYPES.MAP]: <MapQuestion />,
  [QUESTION_TYPES.SHORT_RESPONSE]: <ShortResponse />,
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
  onAddCategory,
  onCancel,
}) {
  const [withQuestionImage, setWithQuestionImage] = useState(() => !!defaultValues?.questionImage);

  const form = useForm({ defaultValues: { ...defaultValues, clues: defaultValues.clues || [] } });
  const choices = form.watch('choices');
  const mapProperties = form.watch('mapProperties');
  const type = form.watch('type');
  const variation = form.watch('variation');
  const hasHelp = form.watch('hasHelp');

  const questionTypesSelectData = useMemo(() => getQuestionTypesForSelect(t), [t]);

  const rightAnswerSelected = useMemo(() => {
    if (type === QUESTION_TYPES.MAP) return true;
    if (type === QUESTION_TYPES.MONO_RESPONSE) {
      return choices?.some((item) => item?.isCorrect);
    }

    return type === QUESTION_TYPES.SHORT_RESPONSE;
  }, [type, choices]);

  const answers = useMemo(() => {
    if (!type) return [];
    return form.getValues(SOLUTION_KEY_BY_TYPE[type]) ?? [];
  }, [form.getValues(SOLUTION_KEY_BY_TYPE[type]), form, type]);

  // HANDLERS ·······························································································|

  async function handleOnSaveQuestion() {
    form.handleSubmit((data) => {
      onSaveQuestion(data);
    })();
  }

  function handleOnSave() {
    form.handleSubmit((data) => {
      onSave(data);
    })();
  }

  function handleHideOnHelp(index) {
    const data = [...answers];

    if (index && !isEmpty(data)) {
      // loop through responses and set hideOnHelp to true only on index
      for (let i = 0; i < data.length; i++) {
        data[i].hideOnHelp = i === Number(index);
      }
      form.setValue(SOLUTION_KEY_BY_TYPE[type], data);
    }
  }

  const categoryData = map(categories, (category, index) => ({
    value: category.id ? category.id : index,
    label: category.value,
  }));

  const QuestionComponent = useMemo(() => {
    if (!type) return null;

    return cloneElement(questionComponents[type], {
      form,
      t,
      scrollRef,
    });
  }, [type, variation, form, t, scrollRef]);

  // HIDE ON HELP CONFIG ·················································································|

  const hideAnswersSelectData = useMemo(() => {
    if (isEmpty(answers)) return [];

    let useLetters = true;
    if (type === QUESTION_TYPES.MAP && mapProperties?.markers.type === 'numbering') {
      useLetters = false;
    }

    return map(answers, (item, index) => ({
      value: index,
      label: useLetters ? LETTERS[index] : `${index + 1}`,
      disabled: type === QUESTION_TYPES.MAP ? item?.hideOnHelp : item?.isCorrect,
    }));
  }, [
    JSON.stringify(choices),
    JSON.stringify(mapProperties),
    type,
    answers,
    mapProperties?.markers.type,
  ]);

  const hasEnoughAnswersToAddClues = useMemo(() => {
    if (!QUESTION_TYPES_WITH_MIN_RESPONSES_TO_ADD_CLUES.includes(type)) {
      return true;
    }
    return answers?.length >= 3;
  }, [type, answers]);

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
      answers?.map((item, index) => (item?.hideOnHelp ? index : -1)).filter((item) => item >= 0)[0],
    [answers]
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
        <Box style={{ marginBottom: 20 }}>
          <ContextContainer title={t('questionDetail')}>
            <Box>
              <ContextContainer fullWidth direction="row">
                <Controller
                  control={form.control}
                  name="type"
                  rules={{ required: t('typeRequired') }}
                  render={({ field }) => (
                    <Select
                      required
                      placeholder={t('typePlaceholder')}
                      data={questionTypesSelectData}
                      error={form.formState.errors.type}
                      label={t('typeLabel')}
                      {...field}
                    />
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
            {type ? (
              <>
                <ContextContainer fullWidth direction="row">
                  <Controller
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <Box style={{ width: '230px' }}>
                        <Select
                          {...field}
                          value={field.value}
                          data={categoryData}
                          placeholder={t('categoryPlaceholder')}
                          searchable
                          creatable
                          getCreateLabel={(value) => `+ ${value}`}
                          withinPortal={true}
                          onCreate={(v) => {
                            onAddCategory(v);
                            field.onChange(categoryData.length);
                          }}
                          error={form.formState.errors.category}
                          label={t('categoryLabel')}
                          onChange={(e) => {
                            const item = categoryData[e];
                            if (item) {
                              field.onChange(item.value);
                            } else {
                              field.onChange(e);
                            }
                          }}
                        />
                      </Box>
                    )}
                  />
                </ContextContainer>

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
                      error={form.formState.errors.stem?.text}
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
                {type !== QUESTION_TYPES.MAP ? (
                  <>
                    <Switch
                      checked={withQuestionImage}
                      onChange={(value) => {
                        if (!value) {
                          form.setValue('questionImage', null);
                        }
                        setWithQuestionImage(value);
                      }}
                      label={t('hasCoverLabel')}
                    />
                    {withQuestionImage ? (
                      <Controller
                        control={form.control}
                        name="questionImage"
                        render={({ field }) => <ImagePicker {...field} />}
                      />
                    ) : null}
                  </>
                ) : null}

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
            ) : null}
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
  onAddCategory: PropTypes.func,
};
