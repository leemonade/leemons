import { useEffect, useMemo, useState } from 'react';

import {
  Box,
  Stack,
  Title,
  Button,
  Loader,
  TextInput,
  ActionButton,
  LoadingOverlay,
  ContextContainer,
} from '@bubbles-ui/components';
import { DeleteBinIcon, AddCircleIcon } from '@bubbles-ui/icons/solid';
import { addErrorAlert, addSuccessAlert } from '@layout/alert';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { useQueryClient } from '@tanstack/react-query';
import { ScheduleInput } from '@timetable/components';
import { SelectUserAgent } from '@users/components';
import { compareBySurnamesAndName } from '@users/helpers/compareUsers';
import { useUserAgentsInfo } from '@users/hooks';
import PropTypes from 'prop-types';

import CustomPeriod from './CustomPeriod';
import { EnrollmentTabStyles } from './EnrollmentTab.styles';
import StudentsTable from './StudentsTable';

import prefixPN from '@academic-portfolio/helpers/prefixPN';
import { getClassStudentsKey } from '@academic-portfolio/hooks/keys/classStudents';
import { useRemoveStudentFromClass } from '@academic-portfolio/hooks/mutations/useMutateClass';
import useClassStudents from '@academic-portfolio/hooks/queries/useClassStudents';
import { getProfilesRequest } from '@academic-portfolio/request';

const EnrollmentTab = ({
  classData,
  center,
  subjectData,
  openEnrollmentDrawer,
  updateForm,
  setDirtyForm,
}) => {
  const [t] = useTranslateLoader(prefixPN('tree_page'));
  const { classes } = EnrollmentTabStyles();
  const queryClient = useQueryClient();
  const [teacherProfile, setTeacherProfile] = useState();
  const [mainTeacher, setMainTeacher] = useState(null);
  const [associateTeachers, setAssociateTeachers] = useState([]);
  const [virtualUrl, setVirtualUrl] = useState(null);
  const [customPeriod, setCustomPeriod] = useState(null);
  const [address, setAddress] = useState(null);
  const [schedule, setSchedule] = useState(null);
  const { mutate: removeStudentFromClass, isLoading: removeStudentFromClassLoading } =
    useRemoveStudentFromClass();
  const { data: classStudents, isLoading: classStudentsLoading } = useClassStudents({
    classId: classData?.id,
  });
  const { data: userAgentsInfo, isLoading: userAgentsInfoLoading } = useUserAgentsInfo(
    classStudents || [],
    {
      enabled: classStudents?.length > 0,
    }
  );

  const aliasOrClassroomId = classData?.alias ?? classData?.classroomId;

  useEffect(() => {
    const getTeacherProfile = async () => {
      const response = await getProfilesRequest();
      setTeacherProfile([response?.profiles?.teacher]);
    };

    getTeacherProfile();
  }, [center, classData]);

  useEffect(() => {
    if (classData) {
      // For simplicity we use local states to show the right info in the input fields but still use updateForm to store the values to save
      const formerValues = {
        mainTeacher: classData.teachers?.find((teacher) => teacher.type === 'main-teacher')
          ?.teacher,
        associateTeachers: classData.teachers
          ?.filter((teacher) => teacher.type === 'associate-teacher')
          ?.map((teacher) => teacher.teacher),
        virtualUrl: classData.virtualUrl,
        address: classData.address,
        schedule: { days: classData.schedule ?? [] },
      };

      setMainTeacher(formerValues.mainTeacher ?? null);
      setAssociateTeachers(formerValues.associateTeachers ?? []);
      setAddress(formerValues.address ?? null);
      setVirtualUrl(formerValues.virtualUrl ?? null);
      setSchedule(formerValues.schedule ?? null);
      updateForm.reset(formerValues);
    }
  }, [classData]);

  // HANDLERS ·············································································································||

  const handleRemoveStudentFromClass = (userAgentId) => {
    removeStudentFromClass(
      { classId: classData.id, studentId: userAgentId },
      {
        onSuccess: (result) => {
          if (result) {
            const classStudentsKey = getClassStudentsKey(classData.id);
            queryClient.invalidateQueries(classStudentsKey);
            addSuccessAlert(t('deletedStudentSuccess'));
          }
        },
        onError: () => {
          addErrorAlert(t('deletedStudentError'));
        },
      }
    );
  };

  const checkIsFormDirty = (accessor, value) => {
    const currentFormValues = {
      mainTeacher,
      virtualUrl: virtualUrl || null,
      address: address || null,
      schedule,
      customPeriod: customPeriod ?? null,
    };

    currentFormValues[accessor] = value || null;

    const initialFormValues = {
      mainTeacher:
        classData.teachers?.find((teacher) => teacher.type === 'main-teacher')?.teacher ?? null,
      virtualUrl: classData.virtualUrl ?? null,
      address: classData.address ?? null,
      schedule: { days: classData.schedule ?? [] },
      customPeriod: classData.customPeriod ?? null,
    };

    return JSON.stringify(currentFormValues) !== JSON.stringify(initialFormValues);
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
        }))
        .sort(compareBySurnamesAndName);
    }
    return [];
  }, [userAgentsInfo]);

  const TeacherSelect = useMemo(() => {
    if (teacherProfile && center?.length > 0) {
      return (
        <SelectUserAgent
          value={mainTeacher}
          label={t('class.teacherLabel')}
          profiles={teacherProfile}
          centers={center}
          onChange={(onChangeValue) => {
            setMainTeacher(onChangeValue);
            updateForm.setValue('mainTeacher', onChangeValue);
            const isFormDirty = checkIsFormDirty('mainTeacher', onChangeValue);
            setDirtyForm(isFormDirty);
          }}
        />
      );
    }
    return null;
  }, [mainTeacher, teacherProfile, center, t]);

  const SecondaryTeachersSelect = useMemo(() => {
    if (teacherProfile && center?.length > 0) {
      return (
        <SelectUserAgent
          value={associateTeachers}
          label={t('class.associateTeachersLabel')}
          profiles={teacherProfile}
          centers={center}
          maxSelectedValues={20}
          onChange={(onChangeValue) => {
            setAssociateTeachers(onChangeValue);
            updateForm.setValue('associateTeachers', onChangeValue);
            const isFormDirty = checkIsFormDirty('associateTeachers', onChangeValue);
            setDirtyForm(isFormDirty);
          }}
          omitUsers={mainTeacher}
        />
      );
    }
    return null;
  }, [associateTeachers, mainTeacher, teacherProfile, center, t]);

  if (!TeacherSelect || !classData) {
    return (
      <Stack fullHeight>
        <Loader padded={true} />
      </Stack>
    );
  }

  if (classData?.status === 'updating') {
    return <LoadingOverlay visible />;
  }

  return (
    <ContextContainer sx={{ position: 'relative', paddingInline: 24, padingTop: 0 }}>
      <ContextContainer>
        <Title order={1}>{aliasOrClassroomId}</Title>
        <Title order={2}>{t('class.teachersLabel')}</Title>
        <Stack spacing={4}>
          {teacherProfile && center?.length > 0 && (
            <Box className={classes.mainTeacher}>{TeacherSelect}</Box>
          )}
          {SecondaryTeachersSelect && (
            <Box className={classes.mainTeacher}>{SecondaryTeachersSelect}</Box>
          )}
        </Stack>
      </ContextContainer>

      <ContextContainer>
        <Title order={2}>{t('scheduleAndPlace')}</Title>
        <Stack spacing={4} fullWidth>
          <Box className={classes.inlineInputs}>
            <TextInput
              value={virtualUrl}
              onChange={(onChangeValue) => {
                setVirtualUrl(onChangeValue);
                updateForm.setValue('virtualUrl', onChangeValue);
                const isFormDirty = checkIsFormDirty('virtualUrl', onChangeValue);
                setDirtyForm(isFormDirty);
              }}
              label={t('virtualClassroom')}
            />
          </Box>
          <Box className={classes.inlineInputs}>
            <TextInput
              value={address}
              onChange={(onChangeValue) => {
                setAddress(onChangeValue);
                updateForm.setValue('address', onChangeValue);
                const isFormDirty = checkIsFormDirty('address', onChangeValue);
                setDirtyForm(isFormDirty);
              }}
              label={t('classroomAdress')}
            />
          </Box>
        </Stack>
        <ScheduleInput
          label={t('lessonSchedule')}
          value={schedule}
          onChange={(onChangeValue) => {
            setSchedule(onChangeValue);
            updateForm.setValue('schedule', onChangeValue);
            const isFormDirty = checkIsFormDirty('schedule', onChangeValue);
            setDirtyForm(isFormDirty);
          }}
        />
        <CustomPeriod
          programId={classData?.program}
          parentPeriod={classData?.subject?.id}
          customPeriod={classData?.customPeriod}
          academicKey="class"
          courseId={
            Array.isArray(classData?.courses) ? classData?.courses[0]?.id : classData?.courses?.id
          }
          onChange={(value) => {
            setCustomPeriod(value.value);
            updateForm.setValue('customPeriod', value.value);
            const isFormDirty = checkIsFormDirty('customPeriod', value.value);

            const validResult = value.areValuesDifferent
              ? isFormDirty && value.areValuesValid
              : isFormDirty;

            setDirtyForm(validResult);
          }}
        />
      </ContextContainer>
      <ContextContainer>
        <Title order={2}>{`${t('actualEnrollment')} (${classData?.students?.length} / ${
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
        {classStudents?.length > 0 && (
          <StudentsTable
            data={studentsTableData}
            showSearchBar
            isLoading={
              userAgentsInfoLoading || classStudentsLoading || removeStudentFromClassLoading
            }
          />
        )}
      </ContextContainer>
    </ContextContainer>
  );
};

EnrollmentTab.propTypes = {
  classData: PropTypes.object,
  openEnrollmentDrawer: PropTypes.func,
  setDirtyForm: PropTypes.func,
  center: PropTypes.array,
  updateForm: PropTypes.object,
  subjectData: PropTypes.object,
};

export default EnrollmentTab;
