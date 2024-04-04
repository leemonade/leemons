import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { ContextContainer, Title, Select, Box, Button } from '@bubbles-ui/components';
import { Controller, useForm } from 'react-hook-form';

const EnrollmentTab = ({ classData, setEnrollmentDrawerIsOpen }) => {
  const form = useForm();

  console.log('classData', classData);
  if (!classData) return null;
  return (
    <ContextContainer sx={{ padding: 24 }}>
      <div>{classData?.courses && 'Course ' + classData?.courses?.index}</div>
      <div>
        {classData?.groups?.abbreviation ||
          'Aula ' + classData?.alias ||
          classData?.classWithoutGroupId}
      </div>
      <ContextContainer>
        <Title>{'Docentes 🔫'}</Title>
        <Controller
          name="mainTeacher"
          control={form.control}
          render={({ field, fieldState }) => <Select />}
        />
      </ContextContainer>
      <ContextContainer>
        <Title>{'Horarios y ubicación 🔫'}</Title>
        <Controller
          name="mainTeacher"
          control={form.control}
          render={({ field, fieldState }) => <Select />}
        />
      </ContextContainer>
      <ContextContainer>
        <Title>{'Matriculados actualmente 🔫'}</Title>
        <Box>
          <Button onClick={() => setEnrollmentDrawerIsOpen(true)} variant="link">
            {'Matricular Estudiantes 🔫'}
          </Button>
        </Box>
        <Controller
          name="mainTeacher"
          control={form.control}
          render={({ field, fieldState }) => <Select />}
        />
      </ContextContainer>
    </ContextContainer>
  );
};

EnrollmentTab.propTypes = {
  classData: PropTypes.object,
  setEnrollmentDrawerIsOpen: PropTypes.func,
};

export default EnrollmentTab;
