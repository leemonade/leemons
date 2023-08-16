import React, { useCallback } from 'react';
import PropTypes from 'prop-types';

import { Box, Button } from '@bubbles-ui/components';
import { Controller, FormProvider, useForm } from 'react-hook-form';

import {
  EvaluationType,
  evaluationTypes,
} from '@assignables/components/Assignment/components/EvaluationType';
import { Layout } from '@assignables/components/Assignment/components/Layout';
import { useFormLocalizations } from '@assignables/components/Assignment/Form';

export default function AssignmentDrawer({ assignable, value, onSave }) {
  const form = useForm({ defaultValues: value });
  const localizations = useFormLocalizations();
  const isGradable = !!assignable?.gradable;

  const onSubmit = useCallback(
    form.handleSubmit((values) =>
      onSave({
        config: { ...values?.evaluation?.evaluation },
        raw: values,
      })
    )
  );

  return (
    <FormProvider {...form}>
      <Layout
        onlyContent
        buttonsComponent={
          <Box>
            <Button onClick={onSubmit}>{localizations?.buttons?.save}</Button>
          </Box>
        }
      >
        <Controller
          control={form.control}
          name="evaluation"
          render={({ field }) => (
            <EvaluationType
              {...field}
              assignable={assignable}
              evaluationTypes={isGradable ? ['calificable', 'punctuable'] : ['nonEvaluable']}
              localizations={localizations?.evaluation}
              hideDivider
            />
          )}
        />
      </Layout>
    </FormProvider>
  );
}

AssignmentDrawer.defaultValues = (activity) =>
  activity.gradable ? evaluationTypes.calificable : evaluationTypes.nonEvaluable;

AssignmentDrawer.propTypes = {
  assignable: PropTypes.object,
  onSave: PropTypes.func,
  value: PropTypes.object,
};
