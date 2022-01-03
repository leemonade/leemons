import React from 'react';
import PropTypes from 'prop-types';
import { Controller, useForm } from 'react-hook-form';
import { Box, Title, Group, TextInput, Select, Button } from '@bubbles-ui/components';

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

function NewBranchConfig({ messages, errorMessages, orderedData, isLoading, onSubmit }) {
  const {
    watch,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  return (
    <Box m={32}>
      <Title>{messages.title}</Title>
      <form onSubmit={handleSubmit(onSubmit)}>
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
                  searchable={true}
                  {...field}
                />
              )}
            />
          </Box>
        </Group>
        <Box>
          <Button rounded size="xs" loading={isLoading} loaderPosition="right" type="submit">
            {messages.saveButtonLabel}
          </Button>
        </Box>
      </form>
    </Box>
  );
}

NewBranchConfig.defaultProps = {
  messages: NEW_BRANCH_CONFIG_MESSAGES,
  errorMessages: NEW_BRANCH_CONFIG_ERROR_MESSAGES,
  orderedData: NEW_BRANCH_CONFIG_ORDERED_OPTIONS,
  isLoading: false,
  onSubmit: () => {},
};

NewBranchConfig.propTypes = {
  messages: PropTypes.shape({
    title: PropTypes.string,
    nameLabel: PropTypes.string,
    namePlaceholder: PropTypes.string,
    orderedLabel: PropTypes.string,
    orderedPlaceholder: PropTypes.string,
    orderedNothingFound: PropTypes.string,
    saveButtonLabel: PropTypes.string,
  }),
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
