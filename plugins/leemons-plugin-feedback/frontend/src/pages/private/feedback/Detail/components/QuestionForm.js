/* eslint-disable no-param-reassign */
import {
  Box,
  Button,
  ContextContainer,
  Select,
  Stack,
  Switch,
  Title,
} from '@bubbles-ui/components';
import { TextEditorInput } from '@bubbles-ui/editors';
import { ChevLeftIcon } from '@bubbles-ui/icons/outline';
import { SelectResponse } from '@feedback/pages/private/feedback/Detail/components/SelectResponse';
import { forIn } from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
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

export default function QuestionForm({ t, onSave, defaultValues, onCancel }) {
  const questionTypes = [];
  forIn(questionComponents, (value, key) => {
    questionTypes.push({ value: key, label: t(key) });
  });

  const form = useForm({ defaultValues });
  const type = form.watch('type');

  function save() {
    form.handleSubmit((data) => {
      onSave(data);
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

  return (
    <Box sx={(theme) => ({ marginBottom: theme.spacing[8] })}>
      <ContextContainer>
        <Box>
          <Button variant="light" leftIcon={<ChevLeftIcon />} onClick={onCancel}>
            {t('returnToList')}
          </Button>
        </Box>

        <Title order={4}>{t('questionDetail')}</Title>

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
          <>
            <ContextContainer divided>
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
                      {...field}
                    />
                  )}
                />

                {type
                  ? React.cloneElement(questionComponents[type], {
                      form,
                      t,
                    })
                  : null}
              </ContextContainer>

              <Stack alignItems="center" justifyContent="space-between">
                <Button variant="light" leftIcon={<ChevLeftIcon />} onClick={onCancel}>
                  {t('returnToList')}
                </Button>
                <Button onClick={save}>{t('saveQuestion')}</Button>
              </Stack>
            </ContextContainer>
          </>
        ) : null}
      </ContextContainer>
    </Box>
  );
}

QuestionForm.propTypes = {
  onSave: PropTypes.func,
  defaultValues: PropTypes.object,
  t: PropTypes.func.isRequired,
  onCancel: PropTypes.func,
  categories: PropTypes.array,
};
