/* eslint-disable no-shadow */
import React, { useEffect } from 'react';
import { useForm, useFormContext, Controller } from 'react-hook-form';
import { TextInput, Select, ContextContainer } from '@bubbles-ui/components';
import ConditionalInput from '../../../Inputs/ConditionalInput';

export default function PreTaskSelector() {
  const originalForm = useFormContext();
  const { control, watch } = useForm({
    defaultValues: (() => {
      const preTaskOptions = originalForm.getValues('preTaskOptions');
      const preTask = originalForm.getValues('preTask');

      return {
        ...preTaskOptions,
        showPreTask: (preTask || preTaskOptions?.mandatory) !== undefined,
      };
    })(),
  });

  const condition = watch('condition');
  const minScore = watch('minScore');
  const showPreTask = watch('showPreTask');

  useEffect(() => {
    // EN: When PreTask hidden, reset every preTask field
    // ES: Cuando el PreTask está oculto, resetea cada campo de PreTask
    if (!showPreTask) {
      originalForm.setValue('preTask', undefined);
      originalForm.setValue('preTaskOptions', undefined);
      return;
    }

    // EN: When PreTask is visible, but no condition is selected, reset mandatory fields
    if (!condition && !minScore) {
      originalForm.setValue('preTaskOptions', { mandatory: false });
      return;
    }

    // EN: Set mandatory fields
    // ES: Establece los campos obligatorios
    const preTaskOptions = {
      condition,
      mandatory: true,
    };

    if (minScore) {
      preTaskOptions.minScore = minScore;
    }
    originalForm.setValue('preTaskOptions', preTaskOptions);
  }, [condition, minScore, showPreTask]);

  return (
    <>
      {/*
        EN: Handle PreTask visibility
        ES: Maneja la visibilidad de la pregunta de tarea previe
      */}
      <Controller
        control={control}
        name="showPreTask"
        render={({ field }) => (
          <ConditionalInput
            {...field}
            showOnTrue
            label="Add a pre-task activity"
            render={() => (
              <>
                {/*
                  EN: PreTask id Picker
                  ES: Selector de id de pregunta de tarea previa
                */}
                <Controller
                  control={originalForm.control}
                  name="preTask"
                  render={({ field }) => (
                    <TextInput {...field} label="Task Id  (REPLACE IN FUTURE BY TEST SELECTOR)" />
                  )}
                />
                {/*
                  EN: Handle PreTask mandatory conditions
                  ES: Maneja las condiciones de obligatoriedad de la pregunta de tarea previa
                */}
                <Controller
                  control={control}
                  name="mandatory"
                  render={({ field }) => (
                    // EN: PreTask mandatory condition
                    // ES: Condición de obligatoriedad de la pregunta de tarea previa
                    <ConditionalInput
                      {...field}
                      label="Mandatory to start the Task"
                      showOnTrue
                      render={() => (
                        <ContextContainer direction="row">
                          <Controller
                            control={control}
                            name="condition"
                            shouldUnregister
                            render={({ field }) => (
                              <Select
                                {...field}
                                label="Condition to start the Task"
                                data={[
                                  { label: 'Only take the test', value: 'take' },
                                  {
                                    label: 'Pass the test with a score higher than',
                                    value: 'greater',
                                  },
                                ]}
                              />
                            )}
                          />
                          {/*
                            EN: Minimum Score picker
                            ES: Selector de mínimo de puntaje
                          */}
                          {condition === 'greater' && (
                            <Controller
                              control={control}
                              name="minScore"
                              shouldUnregister
                              render={({ field }) => (
                                <Select
                                  {...field}
                                  label="Score"
                                  data={[{ label: '10', value: '10' }]}
                                />
                              )}
                            />
                          )}
                        </ContextContainer>
                      )}
                    />
                  )}
                />
              </>
            )}
          ></ConditionalInput>
        )}
      />
    </>
  );
}
