import React from 'react';
import PropTypes from 'prop-types';
import { forIn } from 'lodash';
import { Box, Button, ContextContainer, Select, Stack, Title } from '@bubbles-ui/components';
import { TextEditorInput } from '@bubbles-ui/editors';
import { Controller, useForm } from 'react-hook-form';
import { ChevLeftIcon } from '@bubbles-ui/icons/outline';
import { SelectResponse } from '@feedback/pages/private/feedback/Detail/components/SelectResponse';

const questionComponents = {
  singleResponse: <SelectResponse />,
  multiResponse: <SelectResponse multi />,
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

  return (
    <Box sx={(theme) => ({ marginBottom: theme.spacing[8] })}>
      <ContextContainer>
        <Box>
          <Button variant="light" leftIcon={<ChevLeftIcon />} onClick={onCancel}>
            {t('returnToList')}
          </Button>
        </Box>

        <Title order={4}>{t('questionDetail')}</Title>

        <Box style={{ width: '230px' }}>
          <ContextContainer fullWidth direction="row">
            <Controller
              control={form.control}
              name="type"
              rules={{ required: t('typeRequired') }}
              render={({ field }) => (
                <Box style={{ width: '100%' }}>
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
