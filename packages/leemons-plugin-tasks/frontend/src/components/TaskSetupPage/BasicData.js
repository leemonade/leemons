import React, { useEffect, useRef, useCallback } from 'react';
import { isFunction, uniq } from 'lodash';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { Stack, Button, ContextContainer, useDebouncedCallback } from '@bubbles-ui/components';
import { ChevRightIcon } from '@bubbles-ui/icons/outline';
import { AssetFormInput } from '@leebrary/components/AssetFormInput';

function BasicData({
  labels,
  placeholders,
  helps,
  errorMessages,
  onNext,
  sharedData,
  setSharedData,
  editable,
  useObserver,
  onNameChange,
  ...props
}) {
  // ·······························································
  // FORM

  const defaultValues = {
    ...sharedData.asset,
  };

  const coverFile = useRef(null);
  const formData = useForm({ defaultValues });
  const {
    handleSubmit,
    reset,
    watch,
    formState: { isDirty },
  } = formData;

  const { subscribe, unsubscribe, emitEvent } = useObserver();

  const taskName = watch('name');
  const cover = watch('cover');
  useEffect(() => {
    if (cover instanceof File || typeof cover === 'string') {
      coverFile.current = cover;
    }
  }, [cover]);
  const debounced = useDebouncedCallback(500);

  useEffect(() => {
    debounced(() => onNameChange(taskName));
    onNameChange(taskName);
  }, [taskName]);

  useEffect(() => {
    reset(sharedData.asset);
  }, [sharedData]);

  const onSubmit = useCallback(
    (e) => {
      if (coverFile.current) {
        e.cover = coverFile.current;
      }
      const data = {
        ...sharedData,
        asset: e,
        metadata: {
          ...sharedData.metadata,
          visitedSteps: uniq([...(sharedData.metadata?.visitedSteps || []), 'basicData']),
        },
      };
      setSharedData(data);

      return data;
    },
    [setSharedData, sharedData]
  );

  useEffect(() => {
    const f = (event) => {
      if (event === 'saveTask') {
        handleSubmit(
          (e) => {
            onSubmit(e);
            emitEvent('saveData');
          },
          () => {
            emitEvent('saveTaskFailed');
          }
        )();
      } else if (event === 'saveStep') {
        if (!isDirty) {
          emitEvent('stepSaved');
        } else {
          handleSubmit(
            (e) => {
              onSubmit(e);
              emitEvent('stepSaved');
            },
            () => {
              emitEvent('saveStepFailed');
            }
          )();
        }
      }
    };

    subscribe(f);
    return () => {
      unsubscribe(f);
    };
  }, [isDirty, onSubmit, emitEvent, handleSubmit, subscribe, unsubscribe]);

  // ·······························································
  // HANDLERS

  const handleOnNext = (e) => {
    const data = onSubmit(e);
    if (isFunction(onNext)) onNext(data);
  };

  const handleOnSubmit = handleSubmit(handleOnNext);

  // ························································
  // RENDER

  return (
    <ContextContainer divided>
      <AssetFormInput
        form={formData}
        {...{ labels, placeholders, helps, errorMessages }}
        category="assignables.task"
        tagsPluginName="tasks"
        preview
        previewVariant="task"
      />
      <Stack fullWidth justifyContent="end">
        <Button rightIcon={<ChevRightIcon height={20} width={20} />} onClick={handleOnSubmit}>
          {labels.buttonNext}
        </Button>
      </Stack>
    </ContextContainer>
  );
}

BasicData.propTypes = {
  labels: PropTypes.object,
  descriptions: PropTypes.object,
  placeholders: PropTypes.object,
  helps: PropTypes.object,
  errorMessages: PropTypes.object,
  sharedData: PropTypes.any,
  setSharedData: PropTypes.func,
  editable: PropTypes.bool,
  onNext: PropTypes.func,
  useObserver: PropTypes.func,
  onNameChange: PropTypes.func,
};

// eslint-disable-next-line import/prefer-default-export
export { BasicData };
