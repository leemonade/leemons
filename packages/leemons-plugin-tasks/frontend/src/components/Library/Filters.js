import React, { useEffect, useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useForm, Controller, FormProvider } from 'react-hook-form';
import { FilterIcon } from '@bubbles-ui/icons/outline';
import { Text, Box, Button } from '@bubbles-ui/components';
import { useApi } from '@common';
import SelectProgram from '../TaskSetupPage/components/PickSubject/SelectProgram';
import SelectSubjects from '../TaskSetupPage/components/PickSubject/SelectSubjects';
import listTasks from '../../request/task/listTasks';

export default function Filters({ onChange }) {
  const form = useForm();
  const {
    control,
    watch,
    handleSubmit,
    formState: { errors },
  } = form;

  const onSubmit = (values) => {
    const { center, program, subject } = values;

    onChange({
      draft: true,
      center,
      program,
      course: subject && subject[0]?.course,
      subject: subject && subject[0]?.subject,
      level: subject && subject[0]?.level,
    });
  };

  const program = watch('program');
  return (
    <Controller
      name="show"
      control={control}
      render={({ field: { value: show, onChange: onShowChange } }) => (
        <>
          <Box onClick={() => onShowChange(!show)}>
            <FilterIcon />
            <Text>Filter by</Text>
          </Box>
          {show && (
            <FormProvider {...form}>
              <form onSubmit={handleSubmit(onSubmit)}>
                <SelectProgram
                  labels={{
                    center: 'Select Center',
                    program: 'Select Program',
                  }}
                  errorMessages={{
                    center: {
                      required: 'Please select a center',
                    },
                    program: {
                      required: 'Please select a program',
                    },
                  }}
                  placeholders={{
                    center: 'Select Center',
                    program: 'Select Program',
                  }}
                />
                <Controller
                  name="subject"
                  control={control}
                  render={({ field }) => (
                    <SelectSubjects
                      {...field}
                      program={program}
                      labels={{
                        course: 'Course',
                        subject: 'Subject',
                        level: 'Level',
                      }}
                      placeholders={{
                        course: 'Select Course',
                        subject: 'Select Subject',
                        level: 'Select Level',
                      }}
                      errors={errors}
                    />
                  )}
                />
                <Button type="submit">Apply</Button>
              </form>
            </FormProvider>
          )}
        </>
      )}
    />
  );
}

Filters.propTypes = {
  onChange: PropTypes.func.isRequired,
};
