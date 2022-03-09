import React, { useEffect } from 'react';
import loadable from '@loadable/component';
import { useFormContext, FormProvider, useForm, Controller } from 'react-hook-form';
import { ContextContainer, Select } from '@bubbles-ui/components';
import { TextEditor } from '@bubbles-ui/editors';
import ConditionalInput from '../../../Inputs/ConditionalInput';

function useValueUpdater(watch, setValue) {
  useEffect(() => {
    const subscription = watch((value, field) => {
      if (field.name.startsWith('data')) {
        setValue('submission.data', value.data);
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, setValue]);
}

export default function Submissions() {
  const form = useForm();
  const { control, watch } = form;
  const { setValue, control: contextControl } = useFormContext();

  useValueUpdater(watch, setValue);

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
              label="This task is comppleted with the submission of a paper or activity"
              showOnTrue
              render={() => (
                <>
                  <Controller
                    control={contextControl}
                    name="submission.type"
                    render={({ field: type }) => (
                      <Select
                        {...type}
                        data={[
                          {
                            label: 'File',
                            value: 'File',
                          },
                          {
                            label: 'Link',
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

                      return <C />;
                    }}
                  />

                  <Controller
                    control={contextControl}
                    name="submission.description"
                    render={({ field: f }) => <TextEditor {...f} label="Description" />}
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
