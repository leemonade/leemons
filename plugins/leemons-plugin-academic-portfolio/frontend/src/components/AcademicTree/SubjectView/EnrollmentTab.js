import React, { useEffect, useMemo, useState } from 'react';
import { Controller } from 'react-hook-form';
import { useQueryClient } from '@tanstack/react-query';
import PropTypes from 'prop-types';

import {
  ContextContainer,
  Title,
  Box,
  Button,
  ActionButton,
  TextInput,
  Stack,
} from '@bubbles-ui/components';
import { DeleteBinIcon, AddCircleIcon } from '@bubbles-ui/icons/solid';

import { addErrorAlert, addSuccessAlert } from '@layout/alert';
import { useUserAgentsInfo } from '@users/hooks';
import { SelectUserAgent } from '@users/components';
import { ScheduleInput } from '@timetable/components';

import { useRemoveStudentFromClass } from '@academic-portfolio/hooks/mutations/useMutateClass';
import { getProfilesRequest } from '@academic-portfolio/request';
import { EnrollmentTabStyles } from './EnrollmentTab.styles';
import StudentsTable from './StudentsTable';

const EnrollmentTab = ({ classData, centerId, openEnrollmentDrawer, updateForm }) => {
  const { classes } = EnrollmentTabStyles();
  const queryClient = useQueryClient();
  const [teacherProfile, setTeacherProfile] = useState();
  const { mutate: removeStudentFromClass } = useRemoveStudentFromClass();
  const { data: userAgentsInfo } = useUserAgentsInfo(classData?.students || [], {
    enabled: classData?.students?.length > 0,
  });

  useEffect(() => {
    const getTeacherProfile = async () => {
      const response = await getProfilesRequest();
      setTeacherProfile([response?.profiles?.teacher]);
    };

    getTeacherProfile();
  }, [centerId, classData]);

  useEffect(() => {
    if (classData) {
      const mainTeacher = classData.teachers?.find((t) => t.type === 'main-teacher');
      updateForm?.setValue('mainTeacher', mainTeacher?.teacher);
      updateForm?.setValue('virtualUrl', classData.virtualUrl);
      updateForm?.setValue('address', classData.address);
      updateForm?.setValue('schedule', classData.schedule);
      updateForm?.setValue('id', classData.id);
    }
  }, [classData]);

  // HANDLERS ·············································································································||

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

  const handleUpdate = () => {
    const requestBody = updateForm?.getValues();
    console.log('requestBody', requestBody);
  };

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
            control={updateForm?.control}
            render={({ field }) => (
              <SelectUserAgent
                {...field}
                label={'Main Teacher 🔫'}
                profiles={teacherProfile}
                centers={centerId}
              />
            )}
          />
        </Box>
      </ContextContainer>
      <ContextContainer>
        <Title>{'Horarios y ubicación 🔫'}</Title>
        <Stack spacing={4} fullWidth>
          <Box className={classes.inlineInputs}>
            <Controller
              name="virtualUrl"
              control={updateForm?.control}
              render={({ field }) => <TextInput {...field} label={'Aula virtual 🔫'} />}
            />
          </Box>
          <Box className={classes.inlineInputs}>
            <Controller
              name="address"
              control={updateForm?.control}
              render={({ field }) => (
                <TextInput {...field} label={'Dirección o ubicación física del aula 🔫'} />
              )}
            />
          </Box>
        </Stack>
        <Controller
          name="schedule"
          control={updateForm?.control}
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
  centerId: PropTypes.string.isRequired,
  updateForm: PropTypes.object,
};

export default EnrollmentTab;
