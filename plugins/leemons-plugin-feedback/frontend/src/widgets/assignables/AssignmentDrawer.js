import React, { useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Layout } from '@assignables/components/Assignment/components/Layout';
import { useFormLocalizations } from '@assignables/components/Assignment/Form';
import { OtherOptions } from '@assignables/components/Assignment/components/OtherOptions';
import { useForm, FormProvider, Controller } from 'react-hook-form';
import { Box, Button, createStyles } from '@bubbles-ui/components';

// useLocalizations

export const useAssignmentDrawerStyles = createStyles((theme) => ({
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

  useEffect(() => form.setValue('dates.alwaysAvailable', true));

  const onSubmit = useCallback(
    form.handleSubmit((values) =>
      onSave({
        config: {
          showResults: !values.others.hideReport,
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
            name="others"
            render={({ field, fieldState: { error } }) => (
              <OtherOptions
                {...field}
                error={error}
                assignable={assignable}
                localizations={localizations?.others}
                hideSectionHeaders
                showReport
              />
            )}
          />
        </Layout>
      </FormProvider>
    </Box>
  );
}

AssignmentDrawer.defaultValues = () => ({ showResults: true });

AssignmentDrawer.propTypes = {
  assignable: PropTypes.object,
  onSave: PropTypes.func,
  value: PropTypes.object,
};
