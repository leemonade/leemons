import React, { useCallback } from 'react';

import { useForm, FormProvider, Controller } from 'react-hook-form';
import { useFormLocalizations } from '@assignables/components/Assignment/Form';
import { Instructions } from '@assignables/components/Assignment/components/Instructions';
import { Layout } from '@assignables/components/Assignment/components/Layout';
import { Box, Button, createStyles } from '@bubbles-ui/components';

export const useAssignmentDrawerStyles = createStyles(() => ({
  buttons: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'end',
  },
}));

export default function AssignmentDrawer({ value, onSave }) {
  const localizations = useFormLocalizations();
  const form = useForm({
    defaultValues: value,
  });

  const { classes } = useAssignmentDrawerStyles();

  const onSubmit = useCallback(
    form.handleSubmit((values) =>
      onSave({
        config: {
          metadata: {
            statement: values.instructions,
          },
        },
        raw: values,
      })
    ),
    []
  );

  return (
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
          name="instructions"
          render={({ field }) => (
            <Instructions {...field} localizations={localizations?.instructions} hideDivider />
          )}
        />
      </Layout>
    </FormProvider>
  );
}
