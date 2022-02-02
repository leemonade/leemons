import React from 'react';
import PropTypes from 'prop-types';
import { isFunction, isEmpty } from 'lodash';
import { useForm, Controller } from 'react-hook-form';
import { Box, Stack, ContextContainer, TextInput, Button } from '@bubbles-ui/components';
import { ChevRightIcon } from '@bubbles-ui/icons/outline';

function ConfigData({
  labels,
  placeholders,
  helps,
  errorMessages,
  onNext,
  sharedData,
  setSharedData,
  editable,
  ...props
}) {
  // ·······························································
  // FORM

  const defaultValues = {
    tagline: '',
    ...sharedData,
  };

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues });

  // ·······························································
  // HANDLERS

  const handleOnNext = (e) => {
    const data = { ...sharedData, ...e };
    if (isFunction(setSharedData)) setSharedData(data);
    if (isFunction(onNext)) onNext(data);
  };

  // ---------------------------------------------------------------
  // COMPONENT

  return (
    <form onSubmit={handleSubmit(handleOnNext)}>
      <ContextContainer {...props} divided>
        <ContextContainer title={labels.title}>
          <Box>
            <Controller
              control={control}
              name="tagline"
              rules={{ required: errorMessages.tagline?.required }}
              render={({ field }) => (
                <TextInput
                  {...field}
                  label={labels.tagline}
                  placeholder={placeholders.tagline}
                  help={helps.tagline}
                  error={errors.tagline}
                  required={!isEmpty(errorMessages.tagline?.required)}
                />
              )}
            />
          </Box>
        </ContextContainer>
        <Stack fullWidth justifyContent="end">
          <Button type="submit" rightIcon={<ChevRightIcon height={20} width={20} />}>
            {labels.buttonNext}
          </Button>
        </Stack>
      </ContextContainer>
    </form>
  );
}

ConfigData.defaultProps = {
  helps: {},
  labels: {},
  descriptions: {},
  placeholders: {},
  errorMessages: {},
};
ConfigData.propTypes = {
  labels: PropTypes.object,
  descriptions: PropTypes.object,
  placeholders: PropTypes.object,
  helps: PropTypes.object,
  errorMessages: PropTypes.object,
  sharedData: PropTypes.any,
  setSharedData: PropTypes.func,
  editable: PropTypes.bool,
  onNext: PropTypes.func,
};

// eslint-disable-next-line import/prefer-default-export
export { ConfigData };
