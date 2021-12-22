import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Controller, useForm } from 'react-hook-form';
import { Box, Group, TextInput, Select, Button } from '@bubbles-ui/components';
import BranchBlockField from './BranchBlockField';
import {
  BRANCH_CONTENT_ERROR_MESSAGES,
  BRANCH_CONTENT_MESSAGES,
  BRANCH_CONTENT_SELECT_DATA,
} from './branchContentDefaultValues';

function BranchBlock({ messages, errorMessages, isLoading, selectData, defaultValues, onSubmit }) {
  const form = useForm({ defaultValues });

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
    <form
      onSubmit={handleSubmit((data) => {
        const d = { ...data };
        if (defaultValues) d.id = defaultValues.id;
        onSubmit(d);
      })}
    >
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
  messages: BRANCH_CONTENT_MESSAGES,
  errorMessages: BRANCH_CONTENT_ERROR_MESSAGES,
  selectData: BRANCH_CONTENT_SELECT_DATA,
  isLoading: false,
  onSubmit: () => {},
};

BranchBlock.propTypes = {
  messages: PropTypes.object,
  errorMessages: PropTypes.object,
  selectData: PropTypes.object.isRequired,
  defaultValues: PropTypes.object,
  isLoading: PropTypes.bool,
  onSubmit: PropTypes.func,
};

export default BranchBlock;
