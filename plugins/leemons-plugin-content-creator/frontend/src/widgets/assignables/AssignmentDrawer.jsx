import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { useForm, FormProvider, Controller } from 'react-hook-form';
import { useFormLocalizations } from '@assignables/components/Assignment/Form';
import { Instructions } from '@assignables/components/Assignment/components/Instructions';
import {
  Box,
  Button,
  createStyles,
  ContextContainer,
  TotalLayoutFooterContainer,
} from '@bubbles-ui/components';

export const useAssignmentDrawerStyles = createStyles(() => ({
  buttons: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'end',
  },
}));

export default function AssignmentDrawer({ value, onSave, onClose, scrollRef }) {
  const localizations = useFormLocalizations();
  const form = useForm({
    defaultValues: value,
  });

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
      <Box>
        <ContextContainer padded>
          <Controller
            control={form.control}
            name="instructions"
            render={({ field }) => (
              <Instructions {...field} localizations={localizations?.instructions} hideDivider />
            )}
          />
        </ContextContainer>
      </Box>
      <TotalLayoutFooterContainer
        fixed
        style={{ right: 0 }}
        scrollRef={scrollRef}
        width={728}
        rightZone={<Button onClick={onSubmit}>{localizations?.buttons?.save}</Button>}
        leftZone={
          <Button variant="link" onClick={onClose}>
            {localizations?.buttons?.cancel}
          </Button>
        }
      />
    </FormProvider>
  );
}

AssignmentDrawer.propTypes = {
  value: PropTypes.object,
  onSave: PropTypes.func,
  scrollRef: PropTypes.object,
  onClose: PropTypes.func,
};
