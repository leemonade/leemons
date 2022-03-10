import React, { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { useFormContext, Controller } from 'react-hook-form';
import { ContextContainer, TextInput, Checkbox } from '@bubbles-ui/components';
import { TextEditor } from '@bubbles-ui/editors';
import ConditionalInput from '../../../Inputs/ConditionalInput';

export default function SelfReflection({ name, label, description }) {
  const [show, setShow] = useState(false);
  const firstRender = useRef(true);
  const { control, setValue } = useFormContext();

  useEffect(() => {
    if (!firstRender.current && !show) {
      setValue(name, null);
    }
  }, [show]);

  useEffect(() => {
    firstRender.current = false;
  }, []);

  return (
    <ContextContainer title={label}>
      <Controller
        name={name}
        control={control}
        render={({ field: showField }) => (
          <ConditionalInput
            value={Boolean(showField.value) || show}
            onChange={setShow}
            label={description}
            showOnTrue
            render={() => (
              <>
                <Controller
                  name={`${name}.id`}
                  control={control}
                  shouldUnregister
                  render={({ field }) => <TextInput {...field} label="Feedback" />}
                />
                <Controller
                  name={`${name}.description`}
                  control={control}
                  shouldUnregister
                  render={({ field }) => <TextEditor {...field} label="Description" />}
                />
                <Controller
                  name={`${name}.mandatory`}
                  control={control}
                  shouldUnregister
                  render={({ field }) => (
                    <Checkbox {...field} checked={field.value} label="Mandatory to fill the Task" />
                  )}
                />
              </>
            )}
          />
        )}
      />
    </ContextContainer>
  );
}

SelfReflection.propTypes = {
  name: PropTypes.string,
  label: PropTypes.string,
  description: PropTypes.string,
};
