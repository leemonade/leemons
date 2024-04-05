import React, { useEffect, useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useQueryClient } from '@tanstack/react-query';
import PropTypes from 'prop-types';
import { find } from 'lodash';

import {
  ContextContainer,
  Title,
  Select,
  Box,
  Button,
  ActionButton,
  TextInput,
  Stack,
} from '@bubbles-ui/components';
import { DeleteBinIcon, AddCircleIcon } from '@bubbles-ui/icons/solid';

import { addErrorAlert, addSuccessAlert } from '@layout/alert';
import { useUserAgentsInfo } from '@users/hooks';
import { ScheduleInput } from '@timetable/components';

import { useRemoveStudentFromClass } from '@academic-portfolio/hooks/mutations/useMutateClass';
import { EnrollmentTabStyles } from './EnrollmentTab.styles';
import StudentsTable from './StudentsTable';

const EnrollmentTab = ({ classData, openEnrollmentDrawer }) => {
  const { classes } = EnrollmentTabStyles();
  const form = useForm();
  const queryClient = useQueryClient();
  const { mutate: removeStudentFromClass } = useRemoveStudentFromClass();
  const { data: userAgentsInfo } = useUserAgentsInfo(classData?.students || [], {
    enabled: classData?.students?.length > 0,
  });

  const handleRemoveStudentFromClass = (userAgentId) => {
    removeStudentFromClass(
      { classId: classData.id, studentId: userAgentId },
      {
        onSuccess: (result) => {
          if (result) {
            queryClient.invalidateQueries(['subjectDetail', { subject: classData.subject.id }]);
            addSuccessAlert('Estudiante eliminado con éxito 🔫');
          }
        },
        onError: () => {
          addErrorAlert('No se ha podido eliminar al estudiante del aula. 🔫');
        },
      }
    );
  };

  console.log('classData', classData);

  useEffect(() => {
    if (classData) {
      const mainTeacher = find(classData.teachers, { type: 'main-teacher' });
      form.setValue('mainTeacher', mainTeacher?.teacher);
      form.setValue('virtualUrl', classData.virtualUrl);
      form.setValue('address', classData.address);
      form.setValue('schedule', classData.schedule);
    }
  }, [classData]);

  const studentsTableData = useMemo(() => {
    if (userAgentsInfo?.length) {
      return userAgentsInfo
        .filter(({ disabled }) => !disabled)
        .map((userAgent) => ({
          ...userAgent.user,
          actions: (
            <ActionButton
              onClick={() => handleRemoveStudentFromClass(userAgent.id)}
              tooltip={'borrar 🔫'}
              icon={<DeleteBinIcon width={18} height={18} />}
            />
          ),
        }));
    }
    return [];
  }, [userAgentsInfo]);

  return (
    <ContextContainer sx={{ padding: 24 }}>
      <ContextContainer>
        <Title>{'Docentes 🔫'}</Title>
        <Box className={classes.mainTeacher}>
          <Controller
            name="mainTeacher"
            control={form.control}
            render={({ field }) => <Select {...field} label={'Profesor principal 🔫'} />}
          />
        </Box>
      </ContextContainer>
      <ContextContainer>
        <Title>{'Horarios y ubicación 🔫'}</Title>
        <Stack spacing={4} fullWidth>
          <Box className={classes.inlineInputs}>
            <Controller
              name="virtualUrl"
              control={form.control}
              render={({ field }) => <TextInput {...field} label={'Aula virtual 🔫'} />}
            />
          </Box>
          <Box className={classes.inlineInputs}>
            <Controller
              name="address"
              control={form.control}
              render={({ field }) => (
                <TextInput {...field} label={'Dirección o ubicación física del aula 🔫'} />
              )}
            />
          </Box>
        </Stack>
        <Controller
          name="schedule"
          control={form.control}
          render={({ field }) => <ScheduleInput label={'Horario de clase 🔫'} {...field} />}
        />
      </ContextContainer>
      <ContextContainer>
        <Title>{`Matriculados actualmente 🔫 (${classData?.students?.length} / ${classData?.seats})`}</Title>
        <Box>
          <Button
            onClick={() => openEnrollmentDrawer(classData?.id)}
            variant="link"
            leftIcon={<AddCircleIcon />}
          >
            {'Matricular Estudiantes 🔫'}
          </Button>
        </Box>
        {classData?.students?.length > 0 && (
          <StudentsTable data={studentsTableData} showSearchBar />
        )}
      </ContextContainer>
    </ContextContainer>
  );
};

EnrollmentTab.propTypes = {
  classData: PropTypes.object,
  openEnrollmentDrawer: PropTypes.func,
};

export default EnrollmentTab;
