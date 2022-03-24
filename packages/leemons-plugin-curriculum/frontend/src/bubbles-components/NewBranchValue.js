import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Controller, useForm } from 'react-hook-form';
import {
  ActionButton,
  Box,
  Button,
  ContextContainer,
  Stack,
  TextInput,
} from '@bubbles-ui/components';
import { RemoveIcon } from '@bubbles-ui/icons/outline';

export const NEW_BRANCH_VALUE_MESSAGES = {
  nameLabel: 'Name',
  namePlaceholder: 'Branch name...',
  saveButtonLabel: 'Save config',
};

export const NEW_BRANCH_VALUE_ERROR_MESSAGES = {
  nameRequired: 'Field required',
};

function NewBranchValue({
  onCloseBranch,
  messages,
  errorMessages,
  isLoading,
  onSubmit,
  defaultValues,
}) {
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
    <form
      onSubmit={handleSubmit((data) => {
        onSubmit({ ...data, id: defaultValues?.id });
      })}
    >
      <ContextContainer>
        <Stack fullWidth justifyContent="end">
          <ActionButton icon={<RemoveIcon />} onClick={onCloseBranch} />
        </Stack>

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
        <Stack justifyContent="end">
          <Button loading={isLoading} type="submit">
            {messages.saveButtonLabel}
          </Button>
        </Stack>
      </ContextContainer>
    </form>
  );
}

NewBranchValue.defaultProps = {
  messages: NEW_BRANCH_VALUE_MESSAGES,
  errorMessages: NEW_BRANCH_VALUE_ERROR_MESSAGES,
  isLoading: false,
  onSubmit: () => {},
  onCloseBranch: () => {},
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
  onCloseBranch: PropTypes.func,
};

export default NewBranchValue;
