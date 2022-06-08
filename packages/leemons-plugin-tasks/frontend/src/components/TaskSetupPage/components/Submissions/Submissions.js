import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import loadable from '@loadable/component';
import { useFormContext, FormProvider, useForm, Controller } from 'react-hook-form';
import { ContextContainer, Select } from '@bubbles-ui/components';
import { TextEditorInput } from '@bubbles-ui/editors';
import ConditionalInput from '../../../Inputs/ConditionalInput';

function useValueUpdater(form, originalForm) {
  const shouldUpdate = useRef(true);

  // EN: Handle dynamic form changes
  // ES: Manejar cambios en el formulario dinámico
  useEffect(() => {
    const subscription = form.watch((value, field) => {
      if (field.name?.startsWith('data')) {
        shouldUpdate.current = false;

        originalForm.setValue('submission.data', value?.data);
      }
    });
    return () => subscription.unsubscribe();
  }, [form, originalForm]);

  // EN: Propagate parent form changes to the child form
  // ES: Propagar cambios del formulario padre al formulario hijo
  useEffect(() => {
    const subscription = originalForm.watch((value, field) => {
      if (shouldUpdate.current && field.name?.startsWith('submission.data')) {
        form.setValue('data', value);
      }

      shouldUpdate.current = true;
    });

    return () => subscription.unsubscribe();
  }, [originalForm?.watch]);

  // useEffect(() => {
  //   const subscription = originalForm.watch((value, field) => {
  //     if (field.name?.startsWith('submission')) {
  //       form.setValue('show', !!value?.submission?.type || !!value?.submission?.description);
  //     }
  //   });

  //   return () => subscription.unsubscribe();
  // }, [originalForm]);

  // EN: Propagate the first value to the child form
  // ES: Propagar el primer valor al formulario hijo
  useEffect(() => {
    const s = originalForm.getValues('submission');

    form.setValue('show', !!s?.type || !!s?.description);

    if (s?.data) {
      form.setValue('data', s?.data);
    }
  }, []);
}

export default function Submissions({ labels, errorMessages }) {
  const form = useForm();
  const { control } = form;
  const originalForm = useFormContext();
  const {
    control: contextControl,
    formState: { errors },
  } = originalForm;

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
      <Controller
        control={control}
        name="show"
        render={({ field }) => (
          <ConditionalInput
            {...field}
            label={labels?.submission?.checkDescription}
            onChange={(value) => {
              field.onChange(value);
              if (!value) {
                originalForm.setValue('submission', null);
              }
            }}
            showOnTrue
            render={() => (
              <ContextContainer>
                <Controller
                  control={contextControl}
                  rules={{
                    required: errorMessages.statement?.required,
                    validate: () =>
                      new Promise((resolve, reject) => {
                        form.handleSubmit(
                          () => {
                            resolve(true);
                          },
                          () => {
                            resolve(false);
                          }
                        )();
                      }),
                  }}
                  name="submission.type"
                  render={({ field: type }) => (
                    <Select
                      {...type}
                      required
                      error={
                        !!errors?.submission?.type?.message?.length &&
                        errors?.submission?.type?.message
                      }
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
                  name="submission.type"
                  render={({ field: { value } }) => {
                    const C = Component(value);

                    return <C labels={labels?.submission[`${value}Type`]} />;
                  }}
                />

                <Controller
                  control={contextControl}
                  name="submission.description"
                  render={({ field: f }) => (
                    <TextEditorInput {...f} label={labels?.submission?.description} />
                  )}
                />
              </ContextContainer>
            )}
          />
        )}
      />
    </FormProvider>
  );
}

Submissions.propTypes = {
  labels: PropTypes.shape({
    submission: PropTypes.shape({
      title: PropTypes.string,
      checkDescription: PropTypes.string,
      type: PropTypes.string,
      types: PropTypes.shape({
        file: PropTypes.string,
        link: PropTypes.string,
      }),
      description: PropTypes.string,
    }).isRequired,
  }).isRequired,
};
