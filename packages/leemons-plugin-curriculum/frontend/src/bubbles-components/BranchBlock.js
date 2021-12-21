import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Controller, useForm } from 'react-hook-form';
import { Box, Group, TextInput, Select, Button } from '@bubbles-ui/components';
import { forIn } from 'lodash';
import BranchBlockField from './BranchBlockField';

export const BRANCH_BLOCK_MESSAGES = {
  blockNameLabel: 'Content Block Name',
  blockNamePlaceholder: 'Name...',
  blockTypeLabel: 'Type',
  blockTypePlaceholder: 'Select...',
  blockTypeNothingFound: 'No data',
  blockOrderedLabel: 'Ordered',
  blockOrderedPlaceholder: 'Select...',
  groupTypeOfContentLabel: 'Type of Content',
  groupTypeOfContentPLaceholder: 'Select...',
  groupContentConfigLabel: 'Content config',
  groupAddColumnButtonLabel: 'Add Column',
  fieldLimitCharactersLabel: 'Limited characters',
  fieldMinLabel: 'Min',
  fieldMinPlaceholder: 'Min...',
  fieldMaxLabel: 'Max',
  fieldMaxPlaceholder: 'Max...',
  blockSaveConfigButtonLabel: 'Save Config',
};

export const BRANCH_BLOCK_ERROR_MESSAGES = {
  blockNameRequired: 'Field required',
  blockTypeRequired: 'Field required',
  blockOrderedRequired: 'Field required',
  fieldMinRequired: 'Field required',
  fieldMaxRequired: 'Field required',
};

export const BRANCH_BLOCK_SELECT_DATA = {
  blockType: [
    {
      label: 'Field',
      value: 'field',
    },
    {
      label: 'Code',
      value: 'code',
    },
    {
      label: 'Text area',
      value: 'textarea',
    },
    {
      label: 'List',
      value: 'list',
    },
    {
      label: 'Group',
      value: 'group',
    },
  ],
  blockOrdered: [
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
  ],
  groupTypeOfContents: [
    {
      label: 'Field',
      value: 'field',
    },
    {
      label: 'Code',
      value: 'code',
    },
    {
      label: 'Text area',
      value: 'textarea',
    },
    {
      label: 'List',
      value: 'list',
    },
  ],
};

function BranchBlock({ messages, errorMessages, isLoading, selectData, onSubmit }) {
  const form = useForm();

  const {
    watch,
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = form;

  useEffect(() => {
    const subscription = watch(({ name, type }, { name: n }) => {
      if (n === 'type') {
        reset({ name, type });
      }
    });
    return () => subscription.unsubscribe();
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Group grow>
        <Box>
          <Controller
            name="name"
            control={control}
            rules={{
              required: errorMessages.blockNameRequired,
            }}
            render={({ field }) => (
              <TextInput
                label={messages.blockNameLabel}
                placeholder={messages.blockNamePlaceholder}
                error={errors.name}
                required
                {...field}
              />
            )}
          />
        </Box>
        <Box>
          <Controller
            name="type"
            control={control}
            rules={{
              required: errorMessages.blockTypeRequired,
            }}
            render={({ field }) => (
              <Select
                label={messages.blockTypeLabel}
                placeholder={messages.blockTypePlaceholder}
                required
                error={errors.type}
                data={selectData.blockType || []}
                nothingFound={messages.blockTypeNothingFound}
                searchable={true}
                {...field}
              />
            )}
          />
        </Box>
      </Group>
      {watch('type') === 'field' ? (
        <BranchBlockField messages={messages} errorMessages={errorMessages} form={form} />
      ) : null}
      <Box>
        <Button rounded size="xs" loading={isLoading} loaderPosition="right" type="submit">
          {messages.blockSaveConfigButtonLabel}
        </Button>
      </Box>
    </form>
  );
}

BranchBlock.defaultProps = {
  messages: BRANCH_BLOCK_MESSAGES,
  errorMessages: BRANCH_BLOCK_ERROR_MESSAGES,
  selectData: BRANCH_BLOCK_SELECT_DATA,
  isLoading: false,
  onSubmit: () => {},
};

BranchBlock.propTypes = {
  messages: PropTypes.object,
  errorMessages: PropTypes.object,
  selectData: PropTypes.object.isRequired,
  isLoading: PropTypes.bool,
  onSubmit: PropTypes.func,
};

export default BranchBlock;
