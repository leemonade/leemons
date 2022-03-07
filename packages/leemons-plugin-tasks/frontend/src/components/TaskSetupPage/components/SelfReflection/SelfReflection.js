import React, { useEffect, useState } from 'react';
import { useForm, useFormContext, useWatch, Controller } from "react-hook-form";
import ConditionalInput from '../../../Inputs/ConditionalInput'
import { ContextContainer, TextInput } from "@bubbles-ui/components";
import { TextEditor } from "@bubbles-ui/editors";

export default function SelfReflection({ name, label, description }) {
  const [disabled, setDisabled] = useState(false);
  const { control, watch, setValue } = useFormContext();
  const form = useForm();

  // EN: Watch for any field to update
  // ES: Observa cualquier campo para actualizar
  const w = useWatch({
    control,
    name: [name, `${name}Description`],
    disabled
  });
  const show = form.watch('show');

  // EN: When the field is updated, check if the form should be visible and unregister watcher
  // ES: Cuando el campo es actualizado, comprueba si el formulario debe estar visible y desregistra el observador
  useEffect(() => {
    if (!show) {

      const s = w.some(v => v);

      if (s) {
        form.setValue('show', true);
      }

      setDisabled(true);
    }

  }, [w]);

  // EN: When the form is hidden, reset every field
  // ES: Cuando el formulario está oculto, resetea cada campo
  useEffect(() => {
    if (!show && show !== undefined) {
      setValue(name, null);
      setValue(`${name}Description`, null);
    }
  }, [show])

  return (
    <ContextContainer title={label}>
      <Controller
        control={form.control}
        name="show"
        render={({ field }) => (
          <ConditionalInput
            {...field}
            label={description}
            showOnTrue
            render={() => (
              <>
                <Controller
                  control={control}
                  name={name}
                  render={({ field }) => (
                    <TextInput {...field} />
                  )}
                />
                <Controller
                  control={control}
                  name={`${name}Description`}
                  render={({ field }) => (
                    <TextEditor {...field} label="Description" placeholder='What do you need from this reflection? Explain it to the student' />
                  )}
                />
              </>
            )}
          />
        )}
      />
    </ContextContainer>
  )
}
