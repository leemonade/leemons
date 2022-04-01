import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { isFunction } from 'lodash';
import { useForm, Controller } from 'react-hook-form';
import { Box, Stack, ContextContainer, Button } from '@bubbles-ui/components';
import { ColorInput } from '@mantine/core';
import { ChevRightIcon, ChevLeftIcon } from '@bubbles-ui/icons/outline';
import { FilePicker } from './components/FilePicker';

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

  const { control, handleSubmit } = useForm({ defaultValues });

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
    <ContextContainer {...props} divided>
      <ContextContainer title={labels.title}>
        <Box>
          <FilePicker />
        </Box>
        <Box>
          <Controller
            control={control}
            name="color"
            render={({ field }) => (
              <ColorInput useHsl compact={false} manual={false} label={labels?.color} {...field} />
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
          <Button
            onClick={handleSubmit(handleOnNext)}
            rightIcon={<ChevRightIcon height={20} width={20} />}
          >
            {labels.buttonNext}
          </Button>
        </Box>
      </Stack>
    </ContextContainer>
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
