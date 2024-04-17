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
  LoadingOverlay,
} from '@bubbles-ui/components';
import { DeleteBinIcon, AddCircleIcon } from '@bubbles-ui/icons/solid';

import { addErrorAlert, addSuccessAlert } from '@layout/alert';
import { useUserAgentsInfo } from '@users/hooks';
import { SelectUserAgent } from '@users/components';
import { ScheduleInput } from '@timetable/components';

import { useRemoveStudentFromClass } from '@academic-portfolio/hooks/mutations/useMutateClass';
import { getProfilesRequest } from '@academic-portfolio/request';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import prefixPN from '@academic-portfolio/helpers/prefixPN';
import { EnrollmentTabStyles } from './EnrollmentTab.styles';
import StudentsTable from './StudentsTable';

const EnrollmentTab = ({ classData, center, openEnrollmentDrawer, updateForm }) => {
  const [t] = useTranslateLoader(prefixPN('tree_page'));
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
  }, [center, classData]);

  useEffect(() => {
    if (classData) {
      const formValues = {
        mainTeacher: classData.teachers?.find((teacher) => teacher.type === 'main-teacher')
          ?.teacher,
        virtualUrl: classData.virtualUrl,
        address: classData.address,
        schedule: { days: classData.schedule ?? [] },
        id: classData.id,
      };
      updateForm.reset(formValues); // Resets the form with new default values
    }
  }, [classData, updateForm]);

  // HANDLERS ·············································································································||

  const handleRemoveStudentFromClass = (userAgentId) => {
    removeStudentFromClass(
      { classId: classData.id, studentId: userAgentId },
      {
        onSuccess: (result) => {
          if (result) {
            queryClient.invalidateQueries(['subjectDetail', { subject: classData.subject.id }]);
            addSuccessAlert(t('deletedStudentSuccess'));
          }
        },
        onError: () => {
          addErrorAlert(t('deletedStudentError'));
        },
      }
    );
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
              tooltip={t('treeRemove')}
              icon={<DeleteBinIcon width={18} height={18} />}
            />
          ),
        }));
    }
    return [];
  }, [userAgentsInfo]);

  const isLoading = useMemo(
    () => !(teacherProfile && center?.length > 0),
    [teacherProfile, center]
  );

  return (
    <>
      <LoadingOverlay visible={isLoading} />

      <ContextContainer sx={{ padding: 24 }}>
        <ContextContainer>
          <Title>{t('teachers')}</Title>
          <Box className={classes.mainTeacher}>
            <Controller
              name="mainTeacher"
              control={updateForm?.control}
              render={({ field }) => (
                <SelectUserAgent
                  {...field}
                  label={t('mainTeacher')}
                  profiles={teacherProfile}
                  centers={center}
                />
              )}
            />
          </Box>
        </ContextContainer>
        <ContextContainer>
          <Title>{t('scheduleAndPlace')}</Title>
          <Stack spacing={4} fullWidth>
            <Box className={classes.inlineInputs}>
              <Controller
                name="virtualUrl"
                control={updateForm?.control}
                render={({ field }) => <TextInput {...field} label={t('virtualClassroom')} />}
              />
            </Box>
            <Box className={classes.inlineInputs}>
              <Controller
                name="address"
                control={updateForm?.control}
                render={({ field }) => <TextInput {...field} label={t('classroomAdress')} />}
              />
            </Box>
          </Stack>
          <Controller
            name="schedule"
            control={updateForm?.control}
            render={({ field }) => <ScheduleInput label={t('lessonSchedule')} {...field} />}
          />
        </ContextContainer>
        <ContextContainer>
          <Title>{`${t('actualEnrollment')} (${classData?.students?.length} / ${
            classData?.seats
          })`}</Title>
          <Box>
            <Button
              onClick={() => openEnrollmentDrawer(classData?.id)}
              variant="link"
              leftIcon={<AddCircleIcon />}
            >
              {t('enrollButton')}
            </Button>
          </Box>
          {classData?.students?.length > 0 && (
            <StudentsTable data={studentsTableData} showSearchBar />
          )}
        </ContextContainer>
      </ContextContainer>
    </>
  );
};

EnrollmentTab.propTypes = {
  classData: PropTypes.object,
  openEnrollmentDrawer: PropTypes.func,
  center: PropTypes.array,
  updateForm: PropTypes.object,
};

export default EnrollmentTab;
