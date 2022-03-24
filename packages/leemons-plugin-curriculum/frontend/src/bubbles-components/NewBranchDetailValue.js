import React, { useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Controller, useForm } from 'react-hook-form';
import formWithTheme from '@common/formWithTheme';
import {
  ActionButton,
  Box,
  Button,
  ContextContainer,
  Stack,
  TextInput,
} from '@bubbles-ui/components';
import { RemoveIcon } from '@bubbles-ui/icons/outline';
import * as _ from 'lodash';

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
  onCloseBranch,
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

  const datasetProps = useMemo(
    () => ({ formData: schemaFormValues }),
    [JSON.stringify(schemaFormValues)]
  );

  const goodDatasetConfig = useMemo(() => {
    const response = _.cloneDeep(schema);
    if (readonly) {
      if (response && response.jsonSchema) {
        _.forIn(response.jsonSchema.properties, (value, key) => {
          if (!response.jsonUI[key]) response.jsonUI[key] = {};
          response.jsonUI[key]['ui:readonly'] = true;
        });
      }
    }
    return response;
  }, [schema, readonly]);

  const [form, formActions] = formWithTheme(
    goodDatasetConfig?.jsonSchema,
    goodDatasetConfig?.jsonUI,
    undefined,
    datasetProps
  );

  async function save() {
    handleSubmit(async (data) => {
      const toSend = { ...data, id: defaultValues?.id };
      let fErrors = [];
      if (formActions.isLoaded()) {
        await formActions.submit();
        fErrors = formActions.getErrors();

        toSend.datasetValues = formActions.getValues();
      }

      if (!fErrors.length) {
        onSubmit(toSend);
      }
    })();
  }

  return (
    <ContextContainer>
      <Stack fullWidth justifyContent="end">
        <ActionButton icon={<RemoveIcon />} onClick={onCloseBranch} />
      </Stack>
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
        <Stack justifyContent="end">
          <Button loading={isLoading} onClick={save}>
            {messages.saveButtonLabel}
          </Button>
        </Stack>
      ) : null}
    </ContextContainer>
  );
}

NewBranchDetailValue.defaultProps = {
  messages: NEW_BRANCH_DETAIL_VALUE_MESSAGES,
  errorMessages: NEW_BRANCH_DETAIL_VALUE_ERROR_MESSAGES,
  isLoading: false,
  onSubmit: () => {},
  onCloseBranch: () => {},
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
  onCloseBranch: PropTypes.func,
};

export default NewBranchDetailValue;
