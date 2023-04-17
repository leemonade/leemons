import React, { useCallback, useEffect, useRef } from 'react';
import { isFunction, omit, uniq } from 'lodash';
import PropTypes from 'prop-types';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { Button, ContextContainer, Stack, Switch } from '@bubbles-ui/components';
import { ChevRightIcon } from '@bubbles-ui/icons/outline';
import { AssetFormInput } from '@leebrary/components/AssetFormInput';
import { useObservableContext } from '@common/context/ObservableContext';

function useUpdateFormData(formData) {
  const { useWatch: useContextWatch } = useObservableContext();

  const [asset, program, subjects, express] = useContextWatch({
    name: [
      'sharedData.asset',
      'sharedData.program',
      'sharedData.subjects',
      'sharedData.metadata.express',
    ],
  });

  useEffect(() => {
    formData.reset({
      ...omit(asset, 'file'),
      program,
      subjects,
      express: !!express,
    });
  }, [asset, program, subjects, express]);
}

function useOnNameOrExpressChange(formData) {
  const { setValue } = useObservableContext();
  const isFirstNameCall = useRef(true);
  const isFirstExpressCall = useRef(true);

  const name = useWatch({ control: formData.control, name: 'name' });
  const isExpress = useWatch({ control: formData.control, name: 'express' });

  useEffect(() => {
    if (isFirstNameCall.current) {
      isFirstNameCall.current = false;
    } else {
      setValue('taskName', name);
    }
  }, [name]);

  useEffect(() => {
    if (isFirstExpressCall.current) {
      isFirstExpressCall.current = false;
    } else {
      setValue('isExpress', !!isExpress);
    }
  }, [isExpress]);
}

function useCoverFileRef(formData) {
  const coverFile = useRef();
  const cover = useWatch({ control: formData.control, name: 'cover' });

  useEffect(() => {
    if (cover instanceof File || typeof cover === 'string') {
      coverFile.current = cover;
    }
  }, [cover]);

  return coverFile;
}

function BasicData({
  labels,
  placeholders,
  helps,
  advancedConfig,
  errorMessages,
  onNext,
  useObserver,
}) {
  // ·······························································
  // FORM
  const { getValues, setValue, useWatch: useObservableWatch } = useObservableContext();
  const formData = useForm();
  const {
    handleSubmit,
    control,
    formState: { isDirty },
  } = formData;

  const taskId = useObservableWatch({ name: 'task.id' });
  const express = !!useWatch({ control, name: 'express' });

  useUpdateFormData(formData);
  useOnNameOrExpressChange(formData);

  const coverFile = useCoverFileRef(formData);

  const { subscribe, unsubscribe, emitEvent } = useObserver();

  const onSubmit = useCallback(
    ({ program, subjects, ...e }) => {
      if (coverFile.current) {
        e.cover = coverFile.current;
      }

      const visitedSteps = getValues('sharedData.metadata.visitedSteps');

      setValue('sharedData.asset', e);
      setValue('sharedData.program', program);
      setValue('sharedData.subjects', subjects);
      setValue('sharedData.metadata.express', !!e.express);
      setValue('sharedData.metadata.visitedSteps', uniq([...(visitedSteps || []), 'basicData']));

      setValue('isExpress', !!e.express);
    },
    [getValues, setValue]
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
    onSubmit(e);
    if (isFunction(onNext)) onNext();
  };

  const handleOnSubmit = handleSubmit(handleOnNext);

  // ························································
  // RENDER

  return (
    <ContextContainer divided>
      <Controller
        name="express"
        control={formData.control}
        render={({ field }) => (
          <Switch label="Tarea express" disabled={!!taskId} checked={!!field.value} {...field} />
        )}
      />
      <AssetFormInput
        form={formData}
        {...{ labels, placeholders, helps, errorMessages }}
        advancedConfig={advancedConfig}
        category="assignables.task"
        useTags={!express}
        tagsPluginName={!express ? 'tasks' : undefined}
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
  onNext: PropTypes.func,
  useObserver: PropTypes.func,
  onNameChange: PropTypes.func,
  advancedConfig: PropTypes.object,
};

// eslint-disable-next-line import/prefer-default-export
export { BasicData };
