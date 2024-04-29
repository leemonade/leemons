/* eslint-disable no-param-reassign */
import React from 'react';
import PropTypes from 'prop-types';
import { forIn, noop } from 'lodash';
import { Controller, useForm } from 'react-hook-form';
import {
  Box,
  Button,
  ContextContainer,
  Select,
  Stack,
  Switch,
  TotalLayoutStepContainer,
  TotalLayoutFooterContainer,
} from '@bubbles-ui/components';
import { TextEditorInput } from '@bubbles-ui/editors';
import { ChevLeftIcon } from '@bubbles-ui/icons/outline';
import { SelectResponse } from './SelectResponse';
import { LikertScale } from './LikertScale';
import { NetPromoterScore } from './NetPromoterScore';
import { OpenResponse } from './OpenResponse';

const questionComponents = {
  singleResponse: <SelectResponse />,
  multiResponse: <SelectResponse multi />,
  likertScale: <LikertScale />,
  netPromoterScore: <NetPromoterScore />,
  openResponse: <OpenResponse />,
};

export default function DetailQuestionForm({
  t,
  stepName,
  scrollRef,
  isPublished,
  store = {},
  defaultValues,
  onSaveQuestion = noop,
  onSave = noop,
  onCancel = noop,
}) {
  const questionTypes = [];
  forIn(questionComponents, (value, key) => {
    questionTypes.push({ value: key, label: t(key) });
  });

  const form = useForm({ defaultValues });
  const type = form.watch('type');

  function handleOnSaveQuestion() {
    form.handleSubmit((data) => {
      onSaveQuestion(data);
    })();
  }

  function handleOnSave() {
    form.handleSubmit(() => {
      onSave();
    })();
  }

  React.useEffect(() => {
    if (type === 'netPromoterScore') {
      form.setValue('question', t('npsStatement'));
      form.setValue('properties.maxLabels', 3);
      form.setValue('properties.veryLikely', t('npsVeryLikely'));
      form.setValue('properties.notLikely', t('npsNotLikely'));
      form.setValue('properties.minResponses', 1);
      form.setValue('properties.maxResponses', 1);
    }
  }, [type]);

  const QuestionComponent = React.useMemo(() => {
    if (!type) return null;

    return React.cloneElement(questionComponents[type], {
      form,
      t,
    });
  }, [type, form, t]);

  return (
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
                  disabled={store.saving || !type}
                  loading={store.saving === 'draft'}
                >
                  {t('saveDraft')}
                </Button>
              ) : null}
              <Button variant="outline" disabled={!type} onClick={handleOnSaveQuestion}>
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
              <Stack alignItems="end" spacing={6}>
                <Controller
                  control={form.control}
                  name="type"
                  rules={{ required: t('typeRequired') }}
                  render={({ field }) => (
                    <Box style={{ width: '230px' }}>
                      <Select
                        required
                        data={questionTypes}
                        error={form.formState.errors.type}
                        label={t('typeLabel')}
                        {...field}
                      />
                    </Box>
                  )}
                />
                <Controller
                  control={form.control}
                  defaultValue={false}
                  name="required"
                  render={({ field }) => (
                    <Switch
                      checked={field.value}
                      orientation="horizontal"
                      label={t('requiredQuestionLabel')}
                      {...field}
                    />
                  )}
                />
              </Stack>
            </ContextContainer>
          </Box>
          {type ? (
            <ContextContainer>
              <Controller
                control={form.control}
                name="question"
                rules={{ required: t('questionRequired') }}
                render={({ field }) => (
                  <TextEditorInput
                    required
                    placeholder={type === 'likertScale' ? t('likertScalePlaceholder') : ''}
                    error={form.formState.errors.question}
                    label={t('questionLabel')}
                    editorStyles={{ minHeight: '96px' }}
                    {...field}
                  />
                )}
              />

              {QuestionComponent}
            </ContextContainer>
          ) : null}
        </ContextContainer>
      </Box>
    </TotalLayoutStepContainer>
  );
}

DetailQuestionForm.propTypes = {
  onSaveQuestion: PropTypes.func,
  defaultValues: PropTypes.object,
  t: PropTypes.func.isRequired,
  onCancel: PropTypes.func,
  onSave: PropTypes.func,
  store: PropTypes.object,
  stepName: PropTypes.string,
  scrollRef: PropTypes.object,
  isPublished: PropTypes.bool,
};
