import React, { useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Controller, useForm } from 'react-hook-form';
import formWithTheme from '@common/formWithTheme';
import { Box, Title, Group, TextInput, Select, Button } from '@bubbles-ui/components';

export const NEW_BRANCH_DETAIL_VALUE_MESSAGES = {
  nameLabel: 'Name',
  namePlaceholder: 'Branch name...',
  saveButtonLabel: 'Save config',
};

export const NEW_BRANCH_DETAIL_VALUE_ERROR_MESSAGES = {
  nameRequired: 'Field required',
};

function NewBranchDetailValue({
  messages,
  errorMessages,
  isLoading,
  onSubmit,
  defaultValues,
  schema,
  schemaFormValues,
  readonly,
}) {
  const {
    reset,
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues]);

  const datasetProps = useMemo(() => ({ formData: schemaFormValues }), [schemaFormValues]);

  console.log(JSON.stringify(schema));

  const [form, formActions] = formWithTheme(
    schema?.jsonSchema,
    schema?.jsonUI,
    undefined,
    datasetProps
  );

  function save() {
    handleSubmit((data) => {
      const toSend = { ...data, id: defaultValues?.id };
      let fErrors = [];
      if (formActions.isLoaded()) {
        formActions.submit();
        fErrors = formActions.getErrors();
        toSend.datasetValues = formActions.getValues();
      }

      if (!fErrors.length) {
        onSubmit(toSend);
      }
    })();
  }

  return (
    <Box m={32}>
      {!readonly ? (
        <form>
          <Box>
            <Controller
              name="name"
              control={control}
              rules={{
                required: errorMessages.nameRequired,
              }}
              render={({ field }) => (
                <TextInput
                  label={messages.nameLabel}
                  placeholder={messages.namePlaceholder}
                  error={errors.name}
                  required
                  {...field}
                />
              )}
            />
          </Box>
        </form>
      ) : (
        <Box>{watch('name')}</Box>
      )}

      <Box>{form}</Box>

      {!readonly ? (
        <Box>
          <Button rounded size="xs" loading={isLoading} loaderPosition="right" onClick={save}>
            {messages.saveButtonLabel}
          </Button>
        </Box>
      ) : null}
    </Box>
  );
}

NewBranchDetailValue.defaultProps = {
  messages: NEW_BRANCH_DETAIL_VALUE_MESSAGES,
  errorMessages: NEW_BRANCH_DETAIL_VALUE_ERROR_MESSAGES,
  isLoading: false,
  onSubmit: () => {},
};

NewBranchDetailValue.propTypes = {
  messages: PropTypes.shape({
    nameLabel: PropTypes.string,
    namePlaceholder: PropTypes.string,
    saveButtonLabel: PropTypes.string,
  }),
  defaultValues: PropTypes.object,
  errorMessages: PropTypes.shape({
    nameRequired: PropTypes.string,
  }),
  schema: PropTypes.shape({
    jsonSchema: PropTypes.object,
    jsonUI: PropTypes.object,
  }),
  schemaFormValues: PropTypes.object,
  onSubmit: PropTypes.func,
  isLoading: PropTypes.bool,
  readonly: PropTypes.bool,
};

export default NewBranchDetailValue;
