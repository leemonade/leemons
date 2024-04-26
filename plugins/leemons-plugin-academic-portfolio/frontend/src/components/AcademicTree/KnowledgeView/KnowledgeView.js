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
import { useGetKnowledgeArea } from '@academic-portfolio/hooks';
import { SelectUserAgent } from '@users/components';
import { Link } from 'react-router-dom';
import { getProfilesRequest } from '@academic-portfolio/request';
import { useUpdateKnowledgeArea } from '@academic-portfolio/hooks/mutations/useMutateKnowledgeArea';
import { addErrorAlert, addSuccessAlert } from '@layout/alert';
import { KnowledgeViewStyles } from './KnowledgeView.styles';

const KnowledgeView = ({ program, knowledgeTreeNode, scrollRef, openEnrollmentDrawer }) => {
  const [t] = useTranslateLoader(prefixPN('tree_page'));
  const [teacherProfile, setTeacherProfile] = useState();
  const [hasResponsableChanged, setHasResponsableChanged] = useState(false);
  const { classes } = KnowledgeViewStyles();
  const { data: knowledgeArea, isLoading: knowledgeAreaIsLoading } = useGetKnowledgeArea(
    { id: knowledgeTreeNode?.itemId },
    { enabled: !!knowledgeTreeNode?.itemId }
  );
  const centerId = program?.centers?.[0];
  const defaultValues = {
    id: knowledgeArea?.id,
    name: knowledgeArea?.name,
    abbreviation: knowledgeArea?.name,
    managers: knowledgeArea?.manager ? [knowledgeArea.manager] : [],
    center: centerId,
  };
  const { mutate: mutateKnowledgeArea, isLoading: mutateKnowledgeAreaLoading } =
    useUpdateKnowledgeArea();
  const { control, setValue, getValues, reset } = useForm({ defaultValues });
  const stackRef = useRef();

  useEffect(() => {
    if (knowledgeArea) {
      const newDefaultValues = {
        id: knowledgeArea.id,
        name: knowledgeArea.name,
        abbreviation: knowledgeArea.name,
        managers: knowledgeArea.manager ? [knowledgeArea.manager] : [],
        center: centerId,
      };
      reset(newDefaultValues);
    }
  }, [knowledgeArea, reset, centerId]);

  const handleAssignManager = () => {
    const values = getValues();
    mutateKnowledgeArea(values, {
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
  }, [centerId, knowledgeArea]);

  const isLoading = useMemo(
    () => knowledgeAreaIsLoading || !(teacherProfile && centerId),
    [teacherProfile, centerId, knowledgeAreaIsLoading]
  );

  return (
    <TotalLayoutStepContainer
      stepName={
        knowledgeTreeNode?.text
          ? `${program?.name} - ${knowledgeTreeNode?.text}`
          : program?.name ?? ''
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
              loading={mutateKnowledgeAreaLoading}
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
                <Text strong>{t('courseAlias')} </Text>
                <Text>{knowledgeArea?.abbreviation} </Text>
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

KnowledgeView.propTypes = {
  program: PropTypes.object,
  knowledgeTreeNode: PropTypes.object,
  scrollRef: PropTypes.any,
  openEnrollmentDrawer: PropTypes.bool,
};

export { KnowledgeView };
