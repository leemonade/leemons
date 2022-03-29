import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useForm, useFormContext, Controller } from 'react-hook-form';
import { TextInput, Select, NumberInput } from '@bubbles-ui/components';
import ConditionalInput from '../../../Inputs/ConditionalInput';

export default function PreTaskSelector({ labels }) {
  const { control, setValue } = useForm({
    defaultValues: {
      show: false,
    },
  });
  const originalForm = useFormContext();

  useEffect(() => {
    const subscription = originalForm.watch((v) => {
      if (v.name) {
        setValue('show', (v.preTaskOptions?.mandatory || v.preTask) !== null);
        subscription.unsubscribe();
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <Controller
      name="show"
      control={control}
      render={({ field: show }) => (
        <ConditionalInput
          {...show}
          onChange={(value) => {
            if (!value) {
              originalForm.setValue('preTask', null);
              originalForm.setValue('preTaskOptions', null);
              show.onChange(value);
            }
          }}
          showOnTrue
          label={labels?.toggler}
          render={() => (
            <>
              <Controller
                name="preTask"
                control={originalForm.control}
                shouldUnregister
                render={({ field }) => (
                  <TextInput {...field} label="Task Id  (REPLACE IN FUTURE BY TEST SELECTOR)" />
                )}
              />
              <Controller
                name="preTaskOptions.mandatory"
                control={originalForm.control}
                shouldUnregister
                render={({ field: mandatory }) => (
                  <ConditionalInput
                    {...mandatory}
                    showOnTrue
                    label={labels?.mandatory}
                    onChange={(value) => {
                      if (!value) {
                        originalForm.setValue('preTaskOptions', null);
                        mandatory.onChange(value);
                      }
                    }}
                    render={() => (
                      <>
                        <Controller
                          name="preTaskOptions.condition"
                          control={originalForm.control}
                          shouldUnregister
                          render={({ field: condition }) => (
                            <>
                              <Select
                                {...condition}
                                label={labels?.condition}
                                data={[
                                  { label: labels?.conditions?.take, value: 'take' },
                                  {
                                    label: labels?.conditions?.greater,
                                    value: 'greater',
                                  },
                                ]}
                              />
                              {condition.value === 'greater' && (
                                <Controller
                                  name="preTaskOptions.minScore"
                                  control={originalForm.control}
                                  shouldUnregister
                                  render={({ field }) => (
                                    <NumberInput {...field} label="Min Score" />
                                  )}
                                />
                              )}
                            </>
                          )}
                        />
                      </>
                    )}
                  />
                )}
              />
            </>
          )}
        />
      )}
    />
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
