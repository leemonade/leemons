import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { isFunction, isEmpty } from 'lodash';
import { useForm, Controller } from 'react-hook-form';
import {
  Box,
  Stack,
  ContextContainer,
  TextInput,
  Button,
  NumberInput,
} from '@bubbles-ui/components';
import { TextEditor } from '@bubbles-ui/editors';
import { ChevRightIcon, ChevLeftIcon } from '@bubbles-ui/icons/outline';

function ContentData({
  labels,
  placeholders,
  helps,
  errorMessages,
  sharedData,
  setSharedData,
  editable,
  onNext,
  onPrevious,
  useObserver,
  ...props
}) {
  // ·······························································
  // FORM

  const defaultValues = {
    methodology: '',
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
          <Controller
            control={control}
            name="methodology"
            rules={{ required: errorMessages.methodology?.required }}
            render={({ field }) => (
              <TextInput
                {...field}
                label={labels.methodology}
                placeholder={placeholders.methodology}
                error={errors.methodology}
                required={!isEmpty(errorMessages.methodology?.required)}
              />
            )}
          />
          <Box>Add Resource from media-library component</Box>
          <Controller
            control={control}
            name="recommendedDuration"
            rules={{ required: errorMessages.Recommendedduration?.required }}
            render={({ field }) => (
              <NumberInput
                {...field}
                label={labels.recommendedDuration}
                error={errors.recommendedDuration}
                min={0}
                required={!isEmpty(errorMessages.recommendedDuration?.required)}
              />
            )}
          />

          <Controller
            control={control}
            name="statement"
            rules={{ required: errorMessages.statement?.required }}
            render={({ field }) => (
              <TextEditor {...field} label={labels.statement} error={errors.statement} />
            )}
          />
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

ContentData.defaultProps = {
  helps: {},
  labels: {},
  descriptions: {},
  placeholders: {},
  errorMessages: {},
};
ContentData.propTypes = {
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
export { ContentData };
