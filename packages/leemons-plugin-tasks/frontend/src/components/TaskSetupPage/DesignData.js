import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { isFunction, isEmpty } from 'lodash';
import { useForm, Controller } from 'react-hook-form';
import { Box, Stack, ContextContainer, ColorInput, Button } from '@bubbles-ui/components';
import { ChevRightIcon, ChevLeftIcon } from '@bubbles-ui/icons/outline';

function DesignData({
  labels,
  placeholders,
  helps,
  errorMessages,
  sharedData,
  setSharedData,
  onNext,
  onPrevious,
  editable,
  useObserver,
  ...props
}) {
  // ·······························································
  // FORM

  const defaultValues = {
    color: '',
    ...sharedData,
  };

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues });

  const { subscribe, unsubscribe, emitEvent } = useObserver();

  useEffect(() => {
    const f = (event) => {
      if (event === 'saveTask') {
        handleSubmit((data) => {
          setSharedData(data);
          emitEvent('saveData');
        })();
      }
    };
    subscribe(f);

    return () => unsubscribe(f);
  }, []);

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
          <Box>leebrary picker</Box>
          <Box>
            <Controller
              control={control}
              name="color"
              rules={{ required: errorMessages.color?.required }}
              render={({ field }) => <ColorInput {...field} />}
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

DesignData.defaultProps = {
  helps: {},
  labels: {},
  descriptions: {},
  placeholders: {},
  errorMessages: {},
};
DesignData.propTypes = {
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
  useObserver: PropTypes.func,
};

// eslint-disable-next-line import/prefer-default-export
export { DesignData };
