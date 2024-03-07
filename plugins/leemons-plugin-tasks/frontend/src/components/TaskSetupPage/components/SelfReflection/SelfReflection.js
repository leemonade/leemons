import React, { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { useFormContext, Controller } from 'react-hook-form';
import { ContextContainer, TextInput, Checkbox, Select, NumberInput } from '@bubbles-ui/components';
import { TextEditorInput } from '@bubbles-ui/editors';
import ConditionalInput from '../../../Inputs/ConditionalInput';

function getValue(value, key, defaultValue) {
  try {
    return JSON.parse(value)[key];
  } catch (e) {
    return defaultValue;
  }
}

function getJSON(value) {
  try {
    return JSON.parse(value);
  } catch (e) {
    return {};
  }
}

export default function SelfReflection({ name, labels, description, showType = false }) {
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
              <Controller
                name={`${name}.type`}
                control={control}
                render={({ field: typeField }) => (
                  <ContextContainer>
                    {showType && !typeField.value && typeField.onChange('freeText')}
                    {showType && (
                      <Select
                        {...typeField}
                        value={typeField.value}
                        label={'Type'}
                        data={[
                          {
                            value: 'freeText',
                            // TRANSLATE: Label
                            label: 'Free text',
                          },
                          {
                            value: 'feedback',
                            // TRANSLATE: Label
                            label: 'Feedback',
                          },
                        ]}
                      />
                    )}

                    <Controller
                      name={`${name}.id`}
                      control={control}
                      shouldUnregister
                      render={({ field }) => (
                        <TextInput
                          {...field}
                          // TODO: Remove temporary free text
                          value={
                            typeField.value === 'freeText'
                              ? getValue(field.value, 'title', '')
                              : field.value
                          }
                          onChange={(value) =>
                            field.onChange(
                              typeField.value === 'freeText'
                                ? JSON.stringify({ ...getJSON(field.value), title: value })
                                : value
                            )
                          }
                          label={showType && typeField.value === 'freeText' ? 'Title' : labels?.id}
                        />
                      )}
                    />
                    <Controller
                      name={`${name}.description`}
                      control={control}
                      shouldUnregister
                      render={({ field }) => (
                        <TextEditorInput {...field} label={labels?.description} />
                      )}
                    />
                    <Controller
                      name={`${name}.id`}
                      control={control}
                      shouldUnregister
                      render={({ field }) => {
                        if (typeField.value !== 'freeText') {
                          return null;
                        }

                        return (
                          <ConditionalInput
                            value={getValue(field.value, 'limitedWords', false)}
                            onChange={(value) =>
                              field.onChange(
                                JSON.stringify({ ...getJSON(field.value), limitedWords: value })
                              )
                            }
                            label={'Limited words'}
                            showOnTrue
                            render={() => (
                              <>
                                <NumberInput
                                  label="min words"
                                  value={getValue(field.value, 'minWords', 0)}
                                  onChange={(value) =>
                                    field.onChange(
                                      JSON.stringify({
                                        ...getJSON(field.value),
                                        minWords: value,
                                      })
                                    )
                                  }
                                />
                                <NumberInput
                                  label="max words"
                                  value={getValue(field.value, 'maxWords', 0)}
                                  onChange={(value) =>
                                    field.onChange(
                                      JSON.stringify({
                                        ...getJSON(field.value),
                                        maxWords: value,
                                      })
                                    )
                                  }
                                />
                              </>
                            )}
                          />
                        );
                      }}
                    />
                    <Controller
                      name={`${name}.mandatory`}
                      control={control}
                      shouldUnregister
                      render={({ field }) => (
                        <Checkbox {...field} checked={field.value} label={labels?.mandatory} />
                      )}
                    />
                  </ContextContainer>
                )}
              />
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
