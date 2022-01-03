import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Controller, useForm } from 'react-hook-form';
import { Box, Title, Group, TextInput, Select, Button } from '@bubbles-ui/components';

export const NEW_BRANCH_VALUE_MESSAGES = {
  nameLabel: 'Name',
  namePlaceholder: 'Branch name...',
  saveButtonLabel: 'Save config',
};

export const NEW_BRANCH_VALUE_ERROR_MESSAGES = {
  nameRequired: 'Field required',
};

function NewBranchValue({ messages, errorMessages, isLoading, onSubmit, defaultValues }) {
  const {
    reset,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues });

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues]);

  return (
    <Box m={32}>
      <form
        onSubmit={handleSubmit((data) => {
          onSubmit({ ...data, id: defaultValues?.id });
        })}
      >
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
        <Box>
          <Button rounded size="xs" loading={isLoading} loaderPosition="right" type="submit">
            {messages.saveButtonLabel}
          </Button>
        </Box>
      </form>
    </Box>
  );
}

NewBranchValue.defaultProps = {
  messages: NEW_BRANCH_VALUE_MESSAGES,
  errorMessages: NEW_BRANCH_VALUE_ERROR_MESSAGES,
  isLoading: false,
  onSubmit: () => {},
};

NewBranchValue.propTypes = {
  messages: PropTypes.shape({
    nameLabel: PropTypes.string,
    namePlaceholder: PropTypes.string,
    saveButtonLabel: PropTypes.string,
  }),
  defaultValues: PropTypes.object,
  errorMessages: PropTypes.shape({
    nameRequired: PropTypes.string,
  }),
  onSubmit: PropTypes.func,
  isLoading: PropTypes.bool,
};

export default NewBranchValue;
