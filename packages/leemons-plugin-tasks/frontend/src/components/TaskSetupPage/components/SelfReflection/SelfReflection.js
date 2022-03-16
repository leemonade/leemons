import React, { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { useFormContext, Controller } from 'react-hook-form';
import { ContextContainer, TextInput, Checkbox } from '@bubbles-ui/components';
import { TextEditor } from '@bubbles-ui/editors';
import ConditionalInput from '../../../Inputs/ConditionalInput';

export default function SelfReflection({ name, labels, description }) {
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
    <ContextContainer title={labels?.title}>
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
                  render={({ field }) => <TextInput {...field} label={labels?.id} />}
                />
                <Controller
                  name={`${name}.description`}
                  control={control}
                  shouldUnregister
                  render={({ field }) => <TextEditor {...field} label={labels?.description} />}
                />
                <Controller
                  name={`${name}.mandatory`}
                  control={control}
                  shouldUnregister
                  render={({ field }) => (
                    <Checkbox {...field} checked={field.value} label={labels?.mandatory} />
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
  labels: PropTypes.shape({
    title: PropTypes.string,
    id: PropTypes.string,
    description: PropTypes.string,
    mandatory: PropTypes.string,
  }),
  description: PropTypes.string,
};
