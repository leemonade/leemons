import React from 'react';
import PropTypes from 'prop-types';
import { isFunction } from 'lodash';
import { useForm, Controller } from 'react-hook-form';
import { Box, Stack, ContextContainer, Switch, Button } from '@bubbles-ui/components';
import { ChevRightIcon, ChevLeftIcon } from '@bubbles-ui/icons/outline';

function PublishData({
  labels,
  placeholders,
  helps,
  errorMessages,
  sharedData,
  setSharedData,
  onNext,
  onPrevious,
  editable,
  ...props
}) {
  // ·······························································
  // FORM

  const defaultValues = {
    assign: false,
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
              name="assign"
              rules={{ required: errorMessages.assign?.required }}
              render={({ field }) => (
                <Switch
                  {...field}
                  label={labels.assign}
                  help={helps.assign}
                  error={errors.assign}
                  required={errorMessages.assign?.required}
                />
              )}
            />
          </Box>
        </ContextContainer>
        <Stack fullWidth justifyContent="space-between">
          <Box>
            <Button
              compact
              variant="light"
              leftIcon={<ChevLeftIcon height={20} width={20} />}
              onClick={onPrevious}
            >
              {labels.buttonPrev}
            </Button>
          </Box>
          <Box>
            <Button type="submit" rightIcon={<ChevRightIcon height={20} width={20} />}>
              {labels.buttonNext}
            </Button>
          </Box>
        </Stack>
      </ContextContainer>
    </form>
  );
}

PublishData.defaultProps = {
  helps: {},
  labels: {},
  descriptions: {},
  placeholders: {},
  errorMessages: {},
};
PublishData.propTypes = {
  labels: PropTypes.object,
  descriptions: PropTypes.object,
  placeholders: PropTypes.object,
  helps: PropTypes.object,
  errorMessages: PropTypes.object,
  sharedData: PropTypes.any,
  setSharedData: PropTypes.func,
  editable: PropTypes.bool,
  onNext: PropTypes.func,
  onPrevious: PropTypes.func,
};

// eslint-disable-next-line import/prefer-default-export
export { PublishData };
