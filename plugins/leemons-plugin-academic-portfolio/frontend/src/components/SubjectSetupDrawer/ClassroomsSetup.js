import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  ContextContainer,
  createStyles,
  TextInput,
  NumberInput,
  Text,
} from '@bubbles-ui/components';
import { Controller, useForm } from 'react-hook-form';

const useStyles = createStyles(() => ({
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: 8,
  },
  th: {
    textAlign: 'start',
    width: 120,
  },
  aulaTh: {
    textAlign: 'start',
    width: 72,
  },
  td: {
    padding: '8px 12px 8px 0',
    borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
    textAlign: 'start',
  },
}));

const ClassroomsSetup = ({ onChange, value }) => {
  const { classes } = useStyles();
  const form = useForm({
    defaultValues: { classroomsAmount: 0 },
  });
  const classroomsAmount = form.watch('classroomsAmount');

  useEffect(() => {
    if (value?.length) {
      const currentClassrooms = form.getValues('classrooms');
      if (JSON.stringify(value) !== JSON.stringify(currentClassrooms)) {
        form.setValue('classrooms', value);
      }
      if (classroomsAmount !== value.length) {
        form.setValue('classroomsAmount', value.length);
      }
    }
  }, [value]);

  const validate = async (index) => {
    const fieldName = `classrooms.${index}.availableSeats`;
    const isValid = await form.trigger(fieldName);

    if (isValid) {
      form.clearErrors(fieldName);
      return true;
    }
    form.setError(fieldName, {
      type: 'manual',
      message: 'This field is required 🌎',
    });
    return false;
  };

  const handleOnChange = async (index) => {
    const validClassroom = await validate(index);

    if (validClassroom) {
      const formClassrooms = form.getValues('classrooms');
      onChange([...formClassrooms]);
    }
  };

  return (
    <ContextContainer>
      <Controller
        name={'classroomsAmount'}
        control={form.control}
        render={({ field }) => (
          <NumberInput
            {...field}
            min={0}
            label={'Cantidad 🌎'}
            customDesign
            sx={{ width: 120 }}
            onChange={(val) => {
              if (val < classroomsAmount) {
                const currentClassrooms = form.getValues('classrooms');
                currentClassrooms.pop();
                form.setValue('classrooms', currentClassrooms);
                field.onChange(val);
                handleOnChange();
              }
              field.onChange(val);
            }}
          />
        )}
      />

      {classroomsAmount > 0 && (
        <table className={classes.table}>
          <thead>
            <tr>
              <th className={classes.aulaTh}>
                <Text size="xs" role="productive" color="primary" strong>
                  Aula
                </Text>{' '}
                🌎
              </th>
              <th className={classes.th}>
                <Text size="xs" role="productive" color="primary" strong>
                  {'Plazas disponibles 🌎' + '*'}
                </Text>
              </th>
              <th className={classes.th}>
                <Text size="xs" role="productive" color="primary" strong>
                  ID de Aula 🌎
                </Text>
              </th>
              <th className={classes.th}>
                <Text size="xs" role="productive" color="primary" strong>
                  Alias 🌎
                </Text>
              </th>
            </tr>
          </thead>
          <tbody>
            {[...Array(classroomsAmount)].map((_, index) => (
              <tr key={index}>
                <td className={classes.td}>
                  <Text placeholder="Aula 🌎">{`${(index + 1).toString().padStart(3, '0')}`}</Text>
                </td>
                <Controller
                  name={`classrooms.${index}.availableSeats`}
                  control={form.control}
                  rules={{
                    required: 'This field is required 🌎',
                    validate: (val) => val >= 1 || 'Value cannot be less than 1 🌎',
                  }}
                  render={({ field, fieldState }) => (
                    <td className={classes.td}>
                      <NumberInput
                        {...field}
                        placeholder="Plazas disponibles 🌎"
                        min={1}
                        onChange={(val) => {
                          field.onChange(val);
                          handleOnChange(index);
                        }}
                        error={fieldState.error?.message}
                      />
                    </td>
                  )}
                />
                <Controller
                  name={`classrooms.${index}.classroomId`}
                  control={form.control}
                  render={({ field }) => (
                    <td className={classes.td}>
                      <TextInput
                        {...field}
                        placeholder="ID de Aula 🌎"
                        onChange={(val) => {
                          field.onChange(val);
                          handleOnChange(index);
                        }}
                      />
                    </td>
                  )}
                />
                <Controller
                  name={`classrooms.${index}.alias`}
                  control={form.control}
                  render={({ field }) => (
                    <td className={classes.td}>
                      <TextInput
                        {...field}
                        placeholder="Alias 🌎"
                        onChange={(val) => {
                          field.onChange(val);
                          handleOnChange(index);
                        }}
                      />
                    </td>
                  )}
                />
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </ContextContainer>
  );
};

ClassroomsSetup.propTypes = {
  onChange: PropTypes.func.isRequired,
  value: PropTypes.array,
};

export default ClassroomsSetup;
