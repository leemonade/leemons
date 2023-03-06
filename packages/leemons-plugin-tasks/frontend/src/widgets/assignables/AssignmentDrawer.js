import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { Layout } from '@assignables/components/Assignment/components/Layout';
import {
  EvaluationType,
  evaluationTypes,
} from '@assignables/components/Assignment/components/EvaluationType';
import { useFormLocalizations } from '@assignables/components/Assignment/Form';
import { useForm, FormProvider, Controller } from 'react-hook-form';
import { Box, Button, createStyles } from '@bubbles-ui/components';

// useLocalizations

export const useAssignmentDrawerStyles = createStyles(() => ({
  buttons: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'end',
  },
}));

export default function AssignmentDrawer({ assignable, value, onSave }) {
  const form = useForm({ defaultValues: value });
  const localizations = useFormLocalizations();
  const { classes } = useAssignmentDrawerStyles();

  const onSubmit = useCallback(
    form.handleSubmit((values) =>
      onSave({
        config: {
          ...values?.evaluation?.evaluation,
          curriculum: Object.fromEntries(
            (values.evaluation.curriculum || []).map((category) => [category, true])
          ),
        },
        raw: values,
      })
    )
  );

  return (
    <Box>
      <FormProvider {...form}>
        <Layout
          onlyContent
          buttonsComponent={
            <Box className={classes.buttons}>
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
                localizations={localizations?.evaluation}
                hideDivider
              />
            )}
          />
        </Layout>
      </FormProvider>
    </Box>
  );
}

AssignmentDrawer.defaultValues = () => evaluationTypes.calificable;

AssignmentDrawer.propTypes = {
  assignable: PropTypes.object,
  onSave: PropTypes.func,
  value: PropTypes.object,
};
