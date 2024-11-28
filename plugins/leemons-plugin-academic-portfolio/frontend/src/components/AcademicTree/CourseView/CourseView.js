import { useEffect, useMemo, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';

import {
  Box,
  Title,
  Stack,
  Text,
  TotalLayoutStepContainer,
  TotalLayoutFooterContainer,
  Alert,
  Loader,
  Button,
} from '@bubbles-ui/components';
import { AddCircleIcon, RemoveIcon } from '@bubbles-ui/icons/outline';
import { addErrorAlert, addSuccessAlert } from '@layout/alert';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { SelectUserAgent } from '@users/components';
import PropTypes from 'prop-types';


import { CourseViewStyles } from './CourseView.styles';

import prefixPN from '@academic-portfolio/helpers/prefixPN';
import { useCourseDetail } from '@academic-portfolio/hooks';
import useUpdateCourse from '@academic-portfolio/hooks/mutations/useMutateCourse';
import { getProfilesRequest } from '@academic-portfolio/request';


const CourseView = ({
  program,
  courseTreeNode,
  scrollRef,
  openEnrollmentDrawer,
  programHasReferenceGroups,
}) => {
  const [t] = useTranslateLoader(prefixPN('tree_page'));
  const [teacherProfile, setTeacherProfile] = useState();
  const [hasResponsableChanged, setHasResponsableChanged] = useState(false);
  const { classes } = CourseViewStyles();

  const { mutate: mutateCourse, isLoading: mutateCourseLoading } = useUpdateCourse();
  const { data: courseDetail, isLoading: courseDetailLoading } = useCourseDetail(
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

  const { control, setValue, getValues, reset } = useForm({ defaultValues });
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
    const values = getValues();
    mutateCourse(values, {
      onSuccess: () => {
        addSuccessAlert(t('assignManagerSuccess'));
      },
      onError: () => {
        addErrorAlert(t('assignManagerError'));
      },
    });
  };
  useEffect(() => {
    const getTeacherProfile = async () => {
      const response = await getProfilesRequest();
      setTeacherProfile([response?.profiles?.teacher]);
    };
    getTeacherProfile();
    setHasResponsableChanged(false);
  }, [centerId, courseDetail]);

  const isLoading = useMemo(
    () => courseDetailLoading || !(teacherProfile && centerId),
    [teacherProfile, centerId, courseDetailLoading]
  );

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
            <Button
              disabled={!hasResponsableChanged}
              onClick={() => handleAssignManager()}
              loading={mutateCourseLoading}
            >
              {t('saveChanges')}
            </Button>
          }
          leftZone={
            <Button
              variant="outline"
              leftIcon={<RemoveIcon />}
              onClick={() => {
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
        {isLoading ? (
          <Stack fullHeight>
            <Loader padded={true} />
          </Stack>
        ) : (
          <>
            <Title order={2}>{t('basicDataTitle')}</Title>
            <Stack spacing={5} className={classes.courseData}>
              <Box>
                <Text strong>{t('courseNumber')} </Text>
                <Text>{courseDetail?.index} </Text>
              </Box>
              <Box>
                <Text strong>{t('courseAlias')} </Text>
                <Text>{`${courseDetail?.index}º`} </Text>
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
                          setValue('managers', []);
                        } else {
                          field.onChange(user);
                          setValue('managers', [user.value]);
                        }
                        setHasResponsableChanged(true);
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
                  <Text strong>{t('responsablePrograms')}</Text>
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
