import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { isFunction } from 'lodash';
import { useForm } from 'react-hook-form';
import { Box, Stack, Button, ContextContainer, useDebouncedCallback } from '@bubbles-ui/components';
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

  const formData = useForm({ defaultValues });
  const { handleSubmit, reset, watch } = formData;

  const { subscribe, unsubscribe, emitEvent } = useObserver();

  const taskName = watch('name');
  const debounced = useDebouncedCallback(500);

  useEffect(() => {
    debounced(() => onNameChange(taskName));
    onNameChange(taskName);
  }, [taskName]);

  useEffect(() => {
    reset(sharedData.asset);
  }, [sharedData]);

  useEffect(() => {
    const f = (event) => {
      if (event === 'saveTask') {
        handleSubmit((e) => {
          setSharedData({
            ...sharedData,
            asset: e,
          });
          emitEvent('saveData');
        })();
      }
    };

    subscribe(f);
    return () => {
      unsubscribe(f);
    };
  }, []);

  // ·······························································
  // HANDLERS

  const handleOnNext = (e) => {
    const data = {
      ...sharedData,
      asset: e,
    };

    if (isFunction(setSharedData)) setSharedData(data);
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
