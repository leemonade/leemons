import React, { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';

import {
  ContextContainer,
  createStyles,
  TextInput,
  NumberInput,
  Text,
} from '@bubbles-ui/components';
import PropTypes from 'prop-types';

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

const ClassroomsSetup = ({ onChange, value, formLabels, existentClassroomsAmount }) => {
  const { classes } = useStyles();
  const form = useForm({
    defaultValues: { classroomsAmount: 0 },
  });
  const classroomsAmount = form.watch('classroomsAmount');

  useEffect(() => {
    if (value?.length) {
      const sortedClassrooms = [...value].sort((a, b) =>
        a.classWithoutGroupId?.localeCompare(b.classWithoutGroupId)
      );

      const currentClassrooms = form.getValues('classrooms');
      if (JSON.stringify(value) !== JSON.stringify(currentClassrooms)) {
        form.setValue('classrooms', sortedClassrooms);
      }
      if (classroomsAmount !== value.length) {
        form.setValue('classroomsAmount', value.length);
      }
    }
  }, [value]);

  const validate = async (index) => {
    const fieldName = `classrooms.${index}.seats`;
    const isValid = await form.trigger(fieldName);

    if (isValid) {
      form.clearErrors(fieldName);
      return true;
    }
    form.setError(fieldName, {
      type: 'manual',
      message: formLabels?.validation?.requiredField,
    });
    return false;
  };

  const handleOnChange = async (index) => {
    const validClassroom = await validate(index);

    if (validClassroom) {
      const formClassrooms = form.getValues('classrooms');
      if (formClassrooms[index]) {
        formClassrooms[index].classWithoutGroupId = `${(index + 1).toString().padStart(3, '0')}`;
      }
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
            min={existentClassroomsAmount ?? 0}
            label={formLabels?.numberOfClassrooms}
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
                  {formLabels?.classroom}
                </Text>
              </th>
              <th className={classes.th}>
                <Text size="xs" role="productive" color="primary" strong>
                  {`${formLabels?.seats || ''}*`}
                </Text>
              </th>
              <th className={classes.th}>
                <Text size="xs" role="productive" color="primary" strong>
                  {formLabels?.classroomId}
                </Text>
              </th>
              <th className={classes.th}>
                <Text size="xs" role="productive" color="primary" strong>
                  {formLabels?.alias}
                </Text>
              </th>
            </tr>
          </thead>
          <tbody>
            {[...Array(classroomsAmount)].map((_, index) => (
              <tr key={`classrom-${index}`}>
                <td className={classes.td}>
                  <Text>
                    {form.getValues(`classrooms.${index}.classWithoutGroupId`) ||
                      `${(index + 1).toString().padStart(3, '0')}`}
                  </Text>
                </td>
                <Controller
                  name={`classrooms.${index}.seats`}
                  control={form.control}
                  rules={{
                    required: formLabels?.validation?.requiredField,
                    validate: (val) => val >= 1 || formLabels?.validation?.atLeastOneSeat,
                  }}
                  render={({ field, fieldState }) => (
                    <td className={classes.td}>
                      <NumberInput
                        {...field}
                        placeholder={formLabels?.seats}
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
                        placeholder={formLabels?.textPlaceholder}
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
                        placeholder={formLabels?.textPlaceholder}
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
  formLabels: PropTypes.object,
  existentClassroomsAmount: PropTypes.number,
};

export default ClassroomsSetup;
