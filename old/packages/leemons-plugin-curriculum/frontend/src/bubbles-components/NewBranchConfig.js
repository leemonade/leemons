import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Controller, useForm } from 'react-hook-form';
import {
  ActionButton,
  Box,
  Button,
  ContextContainer,
  Group,
  Select,
  Stack,
  TextInput,
  Title,
} from '@bubbles-ui/components';
import { RemoveIcon } from '@bubbles-ui/icons/outline';

export const NEW_BRANCH_CONFIG_MESSAGES = {
  title: 'Branch config',
  nameLabel: 'New Branch Name',
  namePlaceholder: 'Branch name...',
  orderedLabel: 'Ordered:',
  orderedPlaceholder: 'Select...',
  orderedNothingFound: 'No data',
  saveButtonLabel: 'Save config',
};

export const NEW_BRANCH_CONFIG_ERROR_MESSAGES = {
  nameRequired: 'Field required',
  orderedRequired: 'Field required',
};

export const NEW_BRANCH_CONFIG_ORDERED_OPTIONS = [
  {
    label: 'Not ordered',
    value: 'not-ordered',
  },
  {
    label: 'Only bullets',
    value: 'bullets',
  },
  {
    label: 'Numbering Style 1 (1,2,3,...)',
    value: 'style-1',
  },
  {
    label: 'Numbering Style 2 (A,B,C,...)',
    value: 'style-2',
  },
  {
    label: 'Custom numbering',
    value: 'custom',
  },
];

function NewBranchConfig({
  messages,
  errorMessages,
  orderedData,
  isLoading,
  onSubmit,
  onCloseBranch,
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
      autoComplete="off"
    >
      <ContextContainer>
        <Stack fullWidth justifyContent="space-between" alignItems="center">
          <Title order={4}>{messages.title}</Title>
          <ActionButton icon={<RemoveIcon />} onClick={onCloseBranch} />
        </Stack>

        <Group align="start" grow>
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
            <Controller
              name="ordered"
              control={control}
              rules={{
                required: errorMessages.orderedRequired,
              }}
              render={({ field }) => (
                <Select
                  label={messages.orderedLabel}
                  placeholder={messages.orderedPlaceholder}
                  required
                  error={errors.ordered}
                  data={orderedData || []}
                  nothingFound={messages.orderedNothingFound}
                  {...field}
                />
              )}
            />
          </Box>
        </Group>
        <Stack justifyContent="end">
          <Button variant="outline" loading={isLoading} type="submit">
            {messages.saveButtonLabel}
          </Button>
        </Stack>
      </ContextContainer>
    </form>
  );
}

NewBranchConfig.defaultProps = {
  messages: NEW_BRANCH_CONFIG_MESSAGES,
  errorMessages: NEW_BRANCH_CONFIG_ERROR_MESSAGES,
  orderedData: NEW_BRANCH_CONFIG_ORDERED_OPTIONS,
  isLoading: false,
  onSubmit: () => {},
  onCloseBranch: () => {},
};

NewBranchConfig.propTypes = {
  onCloseBranch: PropTypes.func,
  messages: PropTypes.shape({
    title: PropTypes.string,
    nameLabel: PropTypes.string,
    namePlaceholder: PropTypes.string,
    orderedLabel: PropTypes.string,
    orderedPlaceholder: PropTypes.string,
    orderedNothingFound: PropTypes.string,
    saveButtonLabel: PropTypes.string,
  }),
  defaultValues: PropTypes.object,
  errorMessages: PropTypes.shape({
    nameRequired: PropTypes.string,
    orderedRequired: PropTypes.string,
  }),
  orderedData: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.any,
      label: PropTypes.string,
    })
  ),
  onSubmit: PropTypes.func,
  isLoading: PropTypes.bool,
};

export default NewBranchConfig;
