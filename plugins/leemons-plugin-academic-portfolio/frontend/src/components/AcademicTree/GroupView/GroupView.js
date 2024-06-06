import React, { useEffect, useMemo, useRef, useState } from 'react';
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
  Loader,
} from '@bubbles-ui/components';
import { Controller, useForm } from 'react-hook-form';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import prefixPN from '@academic-portfolio/helpers/prefixPN';
import { AddCircleIcon, RemoveIcon } from '@bubbles-ui/icons/outline';
import { useGroupDetail } from '@academic-portfolio/hooks';
import useUpdateGroup from '@academic-portfolio/hooks/mutations/useMutateGroup';
import { SelectUserAgent } from '@users/components';
import { Link } from 'react-router-dom';
import { getProfilesRequest } from '@academic-portfolio/request';
import { addErrorAlert, addSuccessAlert } from '@layout/alert';
import { GroupViewStyles } from './GroupView.styles';

const GroupView = ({ program, groupTreeNode, scrollRef, openEnrollmentDrawer }) => {
  const [t] = useTranslateLoader(prefixPN('tree_page'));
  const [teacherProfile, setTeacherProfile] = useState();
  const [hasResponsableChanged, setHasResponsableChanged] = useState(false);
  const { mutate: mutateGroup, isLoading: mutateGroupLoading } = useUpdateGroup();
  const { classes } = GroupViewStyles();
  const { data: groupDetail, isLoading: groupDetailLoading } = useGroupDetail(
    { groupId: groupTreeNode?.itemId },
    { enabled: !!groupTreeNode?.itemId }
  );
  const stackRef = useRef();
  const centerId = program?.centers?.[0];
  const defaultValues = {
    id: groupDetail?.id,
    name: groupDetail?.name,
    abbreviation: groupDetail?.name,
    managers: groupDetail?.manager ? [groupDetail.manager] : [],
  };
  const { control, setValue, reset, getValues } = useForm({ defaultValues });

  useEffect(() => {
    if (groupDetail) {
      const newDefaultValues = {
        id: groupDetail.id,
        name: groupDetail.name,
        abbreviation: groupDetail.name,
        managers: groupDetail.manager ? [groupDetail.manager] : [],
      };
      reset(newDefaultValues);
    }
  }, [groupDetail, reset]);

  const handleAssignManager = () => {
    const values = getValues();
    mutateGroup(values, {
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
  }, [centerId, groupDetail]);

  const isLoading = useMemo(
    () => groupDetailLoading || !(teacherProfile && centerId),
    [teacherProfile, centerId, groupDetailLoading]
  );

  return (
    <TotalLayoutStepContainer
      stepName={
        groupTreeNode?.text ? `${program?.name} - ${groupTreeNode?.text}` : program?.name ?? ''
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
              loading={mutateGroupLoading}
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
                <Text strong>{`${t('abbreviationLabel')}:`} </Text>
                <Text>{groupDetail?.abbreviation} </Text>
              </Box>
              <Box>
                <Text strong>{`${t('seatsNumber')}:`} </Text>
                <Text>{groupDetail?.parentCourseSeats} </Text>
              </Box>
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

GroupView.propTypes = {
  program: PropTypes.object,
  groupTreeNode: PropTypes.object,
  scrollRef: PropTypes.any,
  openEnrollmentDrawer: PropTypes.bool,
};

export { GroupView };
