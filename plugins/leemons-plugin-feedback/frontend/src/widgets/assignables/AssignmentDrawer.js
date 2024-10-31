import { useEffect, useCallback } from 'react';
import { useForm, FormProvider, Controller } from 'react-hook-form';

import { useFormLocalizations } from '@assignables/components/Assignment/Form';
import { OtherOptions } from '@assignables/components/Assignment/components/OtherOptions';
import { Box, Button, TotalLayoutFooterContainer, ContextContainer } from '@bubbles-ui/components';
import PropTypes from 'prop-types';

export default function AssignmentDrawer({ assignable, value, onSave, onClose, scrollRef }) {
  const form = useForm({ defaultValues: value });
  const localizations = useFormLocalizations();

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
        <Box style={{ paddingBottom: 80 }}>
          <ContextContainer padded>
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
    </Box>
  );
}

AssignmentDrawer.defaultValues = () => ({ showResults: false });

AssignmentDrawer.propTypes = {
  assignable: PropTypes.object,
  onSave: PropTypes.func,
  value: PropTypes.object,
  scrollRef: PropTypes.object,
  onClose: PropTypes.func,
};
