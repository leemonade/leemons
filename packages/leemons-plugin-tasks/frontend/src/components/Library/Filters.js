import React, { useEffect, useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useForm, Controller, FormProvider } from 'react-hook-form';
import { FilterIcon } from '@bubbles-ui/icons/outline';
import { Text, Box, Button, Stack, PageContainer, ContextContainer } from '@bubbles-ui/components';
import { useApi } from '@common';
import SelectProgram from '../TaskSetupPage/components/PickSubject/SelectProgram';
import SelectSubject from '../TaskSetupPage/components/PickSubject/SelectSubject';
import listTasks from '../../request/task/listTasks';

export default function Filters({ onChange }) {
  const form = useForm({
    defaultValues: {
      show: false,
    },
  });
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
      course: subject && subject?.course,
      subject: subject && subject?.subject,
      level: subject && subject?.level,
    });
  };

  const program = watch('program');
  return (
    <Controller
      name="show"
      control={control}
      render={({ field: { value: show, onChange: onShowChange } }) => (
        <ContextContainer>
          <Box onClick={() => onShowChange(!show)} style={{ cursor: 'pointer' }}>
            <FilterIcon />
            <Text>Filter by</Text>
          </Box>
          {show && (
            <PageContainer>
              <FormProvider {...form}>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <Stack spacing={5} direction="row" alignItems={'end'}>
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
                        <SelectSubject
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
                    <Button type="submit" variant="light">
                      Apply
                    </Button>
                  </Stack>
                </form>
              </FormProvider>
            </PageContainer>
          )}
        </ContextContainer>
      )}
    />
  );
}

Filters.propTypes = {
  onChange: PropTypes.func.isRequired,
};
