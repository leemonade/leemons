import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { isFunction, isEmpty } from 'lodash';
import { useForm, Controller, FormProvider } from 'react-hook-form';
import {
  Box,
  Stack,
  ContextContainer,
  TextInput,
  Button,
  Textarea,
  Paragraph,
} from '@bubbles-ui/components';
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
  ...props
}) {
  // ·······························································
  // FORM

  const defaultValues = {
    ...sharedData,
    subjects: [],
  };

  const formData = useForm({ defaultValues });
  const {
    control,
    watch,
    handleSubmit,
    formState: { errors },
    reset,
  } = formData;

  const { subscribe, unsubscribe, emitEvent } = useObserver();

  useEffect(() => {
    reset(sharedData);
  }, [sharedData]);

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
    return () => {
      unsubscribe(f);
    };
  }, []);

  // ·······························································
  // HANDLERS

  const handleOnNext = (e) => {
    const data = {
      ...sharedData,
      ...e,
    };

    if (isFunction(setSharedData)) setSharedData(data);
    if (isFunction(onNext)) onNext(data);
  };

  // ·······························································
  // SUBJECTS

  const program = watch('program');

  // ---------------------------------------------------------------
  // COMPONENT

  return (
    <Box sx={(theme) => ({ maxWidth: theme.breakpoints.md })}>
      <AssetFormInput
        form={formData}
        {...{ labels, placeholders, helps, errorMessages }}
        category="assignables.task"
        preview
      />
    </Box>
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
};

// eslint-disable-next-line import/prefer-default-export
export { BasicData };
