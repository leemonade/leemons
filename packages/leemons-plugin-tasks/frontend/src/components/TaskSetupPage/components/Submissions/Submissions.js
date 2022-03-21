import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import loadable from '@loadable/component';
import { useFormContext, FormProvider, useForm, Controller } from 'react-hook-form';
import { ContextContainer, Select } from '@bubbles-ui/components';
import { TextEditor } from '@bubbles-ui/editors';
import ConditionalInput from '../../../Inputs/ConditionalInput';

function useValueUpdater(form, originalForm) {
  const shouldUpdate = useRef(true);

  // EN: Handle dynamic form changes
  // ES: Manejar cambios en el formulario dinámico
  useEffect(() => {
    const subscription = form.watch((value, field) => {
      if (field.name?.startsWith('data')) {
        shouldUpdate.current = false;
        originalForm.setValue('submissions.data', value?.data);
      }
    });
    return () => subscription.unsubscribe();
  }, [form, originalForm]);

  // EN: Propagate parent form changes to the child form
  // ES: Propagar cambios del formulario padre al formulario hijo
  useEffect(() => {
    const subscription = originalForm.watch((value, field) => {
      if (shouldUpdate.current && field.name?.startsWith('submissions.data')) {
        form.setValue('data', value);
      }

      shouldUpdate.current = true;
    });

    return () => subscription.unsubscribe();
  }, [originalForm]);

  useEffect(() => {
    const subscription = originalForm.watch((value, field) => {
      if (field.name?.startsWith('submissions')) {
        form.setValue('show', !!value?.submissions?.type || !!value?.submissions?.description);
      }
    });

    return () => subscription.unsubscribe();
  }, [originalForm]);

  // EN: Propagate the first value to the child form
  // ES: Propagar el primer valor al formulario hijo
  useEffect(() => {
    const s = originalForm.getValues('submissions');

    form.setValue('show', !!s?.type || !!s?.description);

    if (s?.data) {
      form.setValue('data', s?.data);
    }
  }, []);
}

export default function Submissions({ labels }) {
  const form = useForm();
  const { control } = form;
  const originalForm = useFormContext();
  const { control: contextControl } = originalForm;

  useValueUpdater(form, originalForm);

  const Component = (type) =>
    loadable(() => {
      const validTypes = ['File'];

      if (!validTypes.includes(type)) {
        return Promise.resolve(() => <></>);
      }

      return import(`./components/${type}`);
    });

  return (
    <FormProvider {...form}>
      <ContextContainer title="Submissions">
        <Controller
          control={control}
          name="show"
          render={({ field }) => (
            <ConditionalInput
              {...field}
              label={labels?.submission?.title}
              showOnTrue
              render={() => (
                <>
                  <Controller
                    control={contextControl}
                    name="submissions.type"
                    render={({ field: type }) => (
                      <Select
                        {...type}
                        label={labels?.submission?.type}
                        data={[
                          {
                            label: labels?.submission?.types?.file,
                            value: 'File',
                          },
                          {
                            label: labels?.submission?.types?.link,
                            value: 'Link',
                          },
                        ]}
                      />
                    )}
                  />

                  <Controller
                    control={contextControl}
                    name="submissions.type"
                    render={({ field: { value } }) => {
                      const C = Component(value);

                      return <C labels={labels?.submission[`${value}Type`]} />;
                    }}
                  />

                  <Controller
                    control={contextControl}
                    name="submissions.description"
                    render={({ field: f }) => (
                      <TextEditor {...f} label={labels?.submission?.description} />
                    )}
                  />
                </>
              )}
            />
          )}
        />
      </ContextContainer>
    </FormProvider>
  );
}

Submissions.propTypes = {
  labels: PropTypes.shape({
    submission: PropTypes.shape({
      title: PropTypes.string,
      type: PropTypes.string,
      types: PropTypes.shape({
        file: PropTypes.string,
        link: PropTypes.string,
      }),
      description: PropTypes.string,
    }).isRequired,
  }).isRequired,
};
