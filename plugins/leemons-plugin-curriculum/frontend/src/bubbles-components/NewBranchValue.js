import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Controller, useForm } from 'react-hook-form';
import {
  ActionButton,
  Alert,
  Button,
  ContextContainer,
  Select,
  Stack,
  TextInput,
} from '@bubbles-ui/components';
import { RemoveIcon } from '@bubbles-ui/icons/outline';

export const NEW_BRANCH_VALUE_MESSAGES = {
  nameLabel: 'Name',
  subjectLabel: 'Subject',
  namePlaceholder: 'Branch name...',
  saveButtonLabel: 'Save config',
  noSubjectsFound: 'No subjects found',
};

export const NEW_BRANCH_VALUE_ERROR_MESSAGES = {
  nameRequired: 'Field required',
};

function NewBranchValue({
  isSubject,
  subjectData,
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
      autoComplete="off"
    >
      <ContextContainer>
        <Stack fullWidth justifyContent="end">
          <ActionButton icon={<RemoveIcon />} onClick={onCloseBranch} />
        </Stack>

        <ContextContainer>
          {isSubject ? (
            <>
              {subjectData && subjectData.length ? (
                <Controller
                  name="academicItem"
                  control={control}
                  render={({ field }) => (
                    <Select label={messages.subjectLabel} data={subjectData} {...field} />
                  )}
                />
              ) : (
                <Alert severity="error" closeable={false}>
                  {messages.noSubjectsFound}
                </Alert>
              )}
            </>
          ) : (
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
          )}
        </ContextContainer>
        {!isSubject || (isSubject && subjectData.length) ? (
          <Stack justifyContent="end">
            <Button loading={isLoading} type="submit">
              {messages.saveButtonLabel}
            </Button>
          </Stack>
        ) : null}
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
  isSubject: PropTypes.bool,
  subjectData: PropTypes.any,
  messages: PropTypes.shape({
    nameLabel: PropTypes.string,
    subjectLabel: PropTypes.string,
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
