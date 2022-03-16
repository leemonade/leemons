import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useForm, useFormContext, Controller } from 'react-hook-form';
import { TextInput, Select, ContextContainer } from '@bubbles-ui/components';
import ConditionalInput from '../../../Inputs/ConditionalInput';

export default function PreTaskSelector({ labels }) {
  const originalForm = useFormContext();
  const { control, watch, setValue } = useForm({
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
      originalForm.setValue('preTask', null);
      originalForm.setValue('preTaskOptions', null);
      setValue('condition', null);
      setValue('minScore', null);
    }
  }, [showPreTask]);

  useEffect(() => {
    // EN: When PreTask is visible, but no condition is selected, reset mandatory fields
    if (!condition && !minScore) {
      if (originalForm.getValues('preTaskOptions')?.mandatory) {
        originalForm.setValue('preTaskOptions', { mandatory: false });
      }
      return;
    }

    setValue('showPreTask', true);

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
  }, [condition, minScore]);

  return (
    <>
      {/*
        EN: Handle PreTask visibility
        ES: Maneja la visibilidad de la pregunta de tarea previe
      */}
      <Controller
        control={control}
        name="showPreTask"
        render={({ field: showField }) => (
          <ConditionalInput
            {...showField}
            showOnTrue
            label={labels?.toggler}
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
                  render={({ field: mandatoryField }) => (
                    // EN: PreTask mandatory condition
                    // ES: Condición de obligatoriedad de la pregunta de tarea previa
                    <ConditionalInput
                      {...mandatoryField}
                      label={labels?.mandatory}
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
                                label={labels?.condition}
                                data={[
                                  { label: labels?.conditions?.take, value: 'take' },
                                  {
                                    label: labels?.conditions?.greater,
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

PreTaskSelector.propTypes = {
  labels: PropTypes.shape({
    toggler: PropTypes.string,
    mandatory: PropTypes.string,
    condition: PropTypes.string,
    conditions: PropTypes.shape({
      take: PropTypes.string,
      greater: PropTypes.string,
    }),
  }),
};
