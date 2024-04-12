import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Title,
  Stack,
  Text,
  TotalLayoutStepContainer,
  TotalLayoutFooterContainer,
  Alert,
  Button,
} from '@bubbles-ui/components';
import { Controller, useForm } from 'react-hook-form';

import useTranslateLoader from '@multilanguage/useTranslateLoader';
import prefixPN from '@academic-portfolio/helpers/prefixPN';
import { AddCircleIcon, RemoveIcon } from '@bubbles-ui/icons/outline';
import { useCourseDetail } from '@academic-portfolio/hooks';
import { SelectUserAgent } from '@users/components';
import { Link } from 'react-router-dom';
import { getProfilesRequest } from '@academic-portfolio/request';
import useUpdateCourse from '@academic-portfolio/hooks/mutations/useMutateCourse';
import { addErrorAlert, addSuccessAlert } from '@layout/alert';
import { CourseViewStyles } from './CourseView.styles';

const CourseView = ({
  program,
  courseTreeNode,
  scrollRef,
  openEnrollmentDrawer,
  programHasReferenceGroups,
}) => {
  const [t] = useTranslateLoader(prefixPN('tree_page'));
  const [teacherProfile, setTeacherProfile] = useState();
  const [responsable, setResponsable] = useState();
  const { classes } = CourseViewStyles();

  const { mutate: mutateCourse } = useUpdateCourse();
  const { data: courseDetail } = useCourseDetail(
    { groupId: courseTreeNode?.itemId },
    { enabled: !!courseTreeNode?.itemId }
  );
  const stackRef = useRef();
  const centerId = program?.centers?.[0];

  const defaultValues = {
    id: courseDetail?.id,
    name: courseDetail?.name,
    abbreviation: courseDetail?.name,
    managers: courseDetail?.manager ? [courseDetail.manager] : [],
  };

  const { control, setValue, reset } = useForm({ defaultValues });
  useEffect(() => {
    if (courseDetail) {
      const newDefaultValues = {
        id: courseDetail.id,
        name: courseDetail.name,
        abbreviation: courseDetail.abbreviation,
        managers: courseDetail.manager ? [courseDetail.manager] : [],
      };
      reset(newDefaultValues); // Esto actualiza los valores del formulario con los nuevos valores predeterminados
    }
  }, [courseDetail, reset]);
  const handleAssignManager = () => {
    if (responsable) {
      mutateCourse(defaultValues, {
        onSuccess: () => {
          addSuccessAlert(t('assignManagerSuccess'));
        },
        onError: () => {
          addErrorAlert(t('assignManagerError'));
        },
      });
    }
  };
  useEffect(() => {
    const getTeacherProfile = async () => {
      const response = await getProfilesRequest();
      setTeacherProfile([response?.profiles?.teacher]);
    };
    setResponsable(courseDetail?.manager);
    getTeacherProfile();
  }, [centerId, courseDetail]);

  return (
    <TotalLayoutStepContainer
      stepName={
        courseTreeNode?.text ? `${program?.name} - ${courseTreeNode?.text}` : program?.name ?? ''
      }
      clean
      fullWidth
      scrollRef={scrollRef}
      Footer={
        <TotalLayoutFooterContainer
          scrollRef={scrollRef}
          fixed
          rectRef={stackRef}
          rightZone={
            <Button disabled={!responsable} onClick={() => handleAssignManager()}>
              {t('saveChanges')}
            </Button>
          }
          leftZone={
            <Button
              variant="outline"
              leftIcon={<RemoveIcon />}
              onClick={() => {
                setResponsable(null);
                setValue('managers', null);
              }}
            >
              {t('cancelHeaderButton')}
            </Button>
          }
        />
      }
    >
      <Stack direction="column" spacing={3} className={classes.content} ref={stackRef}>
        <Title order={2}>{t('basicDataTitle')}</Title>
        <Stack spacing={5} className={classes.courseData}>
          <Box>
            <Text strong>{t('courseNumber')} </Text>
            <Text>{courseDetail?.index} </Text>
          </Box>
          <Box>
            <Text strong>{t('courseAlias')} </Text>
            <Text>{courseDetail?.name} </Text>
          </Box>
          {!!program?.courseCredits && (
            <Box>
              <Text strong>{t('minimumCredits')} </Text>
              <Text>{program.courseCredits} </Text>
            </Box>
          )}
        </Stack>
        {teacherProfile && centerId && (
          <Box className={classes.responsable}>
            <Controller
              name="managers"
              control={control}
              render={({ field }) => (
                <SelectUserAgent
                  {...field}
                  label={t('responsableLabel')}
                  profiles={teacherProfile}
                  centers={centerId}
                  returnItem
                  maxSelectedValues={1}
                  onChange={(user) => {
                    if (!user) {
                      field.onChange(user);
                      setValue('managers', null);
                    } else {
                      field.onChange(user);
                      setValue('managers', [user]);
                    }
                    setResponsable(user);
                  }}
                />
              )}
            />
          </Box>
        )}
        <Box className={classes.responsableContainer}>
          <Text>{t('responsableMoreConfig')} </Text>
          <Box className={classes.responsableLink}>
            <Link to={'/private/academic-portfolio/programs'}>
              <Text>{t('responsablePrograms')}</Text>
            </Link>
          </Box>
        </Box>
        {!programHasReferenceGroups && (
          <>
            <Box className={classes.titleContainer}>
              <Title order={2}>{t('enrollTitle')}</Title>
            </Box>

            <Box>
              <Alert title={t('AlertTitle')} variant="block" closeable={false}>
                <Box>
                  <Text>{t('AlertDescription')} </Text>
                </Box>
                <Text>{t('AlertNote')} </Text>
              </Alert>
              <Box className={classes.enrollButton}>
                <Button
                  variant="link"
                  leftIcon={<AddCircleIcon />}
                  onClick={() => openEnrollmentDrawer()}
                >
                  {t('enrollButton')}
                </Button>
              </Box>
            </Box>
          </>
        )}
      </Stack>
    </TotalLayoutStepContainer>
  );
};

CourseView.propTypes = {
  program: PropTypes.object,
  courseTreeNode: PropTypes.object,
  scrollRef: PropTypes.any,
  openEnrollmentDrawer: PropTypes.bool,
  programHasReferenceGroups: PropTypes.bool,
};

export { CourseView };
