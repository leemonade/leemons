import React, { useEffect, useState } from 'react';
import { useFormContext, useForm, useWatch, Controller } from "react-hook-form";
import ConditionalInput from '../../../Inputs/ConditionalInput'
import { ContextContainer, TextInput } from "@bubbles-ui/components";

export default function Feedback({ name, label, description }) {
  const [disabled, setDisabled] = useState(false);
  const { control, watch } = useFormContext();
  const form = useForm();

  // EN: Watch for any field to update
  // ES: Observa cualquier campo para actualizar
  const feedback = useWatch({
    control,
    name,
    disabled
  });

  const show = form.watch('show');

  // EN: When the field is updated, check if the form should be visible and unregister watcher
  // ES: Cuando el campo es actualizado, comprueba si el formulario debe estar visible y desregistra el observador
  useEffect(() => {
    if (feedback && !show) {
      form.setValue('show', true);
    }

    setDisabled(true);
  }, [feedback]);

  // EN: When the form is hidden, reset every field
  // ES: Cuando el formulario está oculto, resetea cada campo
  useEffect(() => {
    if (!show && show !== undefined) {
      setValue(name, null);
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
              <Controller
                control={control}
                name={name}
                render={({ field }) => (
                  <TextInput {...field} />
                )}
              />
            )}
          />
        )}
      />
    </ContextContainer>
  )
}
