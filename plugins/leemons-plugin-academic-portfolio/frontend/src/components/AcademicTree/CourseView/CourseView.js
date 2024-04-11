import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Title,
  Stack,
  Text,
  Select,
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
import { CourseViewStyles } from './CourseView.styles';

const CourseView = ({ program, groupNode, scrollRef, openEnrollmentDrawer }) => {
  const [t] = useTranslateLoader(prefixPN('tree_page'));
  const [teacherProfile, setTeacherProfile] = useState();
  const [responsable, setResponsable] = useState();
  const { classes } = CourseViewStyles();
  const { control } = useForm();
  const { data: courseDetail } = useCourseDetail(
    { groupId: groupNode?.itemId },
    { enabled: !!groupNode?.itemId }
  );
  const centerId = program?.centers?.[0]?.id;
  console.log('courseDetail', courseDetail);
  // console.log('groupNode', groupNode);
  useEffect(() => {
    const getTeacherProfile = async () => {
      const response = await getProfilesRequest();
      setTeacherProfile([response?.profiles?.teacher]);
    };

    getTeacherProfile();
  }, [centerId]);
  return (
    <TotalLayoutStepContainer
      stepName={groupNode?.text ? `${program?.name} - ${groupNode?.text}` : program?.name ?? ''}
      clean
      fullWidth
      scrollRef={scrollRef}
      Footer={
        <TotalLayoutFooterContainer
          scrollRef={scrollRef}
          fixed
          fullWidth
          // width="auto"
          // style={{ width: '100%' }}
          rightZone={<Button onClick={() => 'hello'}>{'Guardar Cambios 🔫'}</Button>}
          leftZone={
            <Button variant="outline" leftIcon={<RemoveIcon />}>
              {'Cancelar 🔫'}
            </Button>
          }
        />
      }
    >
      <Stack direction="column" spacing={3} className={classes.content}>
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
        <Box className={classes.responsable}>
          <Controller
            name="responsable"
            control={control}
            defaultValue={courseDetail?.manager}
            value={responsable}
            render={({ field }) => (
              <SelectUserAgent
                // {...field}
                label={t('responsable')}
                profiles={teacherProfile}
                centers={centerId}
                onChange={(user) => setResponsable(user)}
              />
            )}
          />
        </Box>
        <Box className={classes.responsableContainer}>
          <Text>{t('responsableMoreConfig')} </Text>
          <Box className={classes.responsableLink}>
            <Link to={'/private/academic-portfolio/programs'}>
              <Text>{t('responsablePrograms')}</Text>
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
      </Stack>
    </TotalLayoutStepContainer>
  );
};

CourseView.propTypes = {
  program: PropTypes.object,
  groupNode: PropTypes.shape({
    id: PropTypes.string,
    parent: PropTypes.oneOfType([
      PropTypes.shape({
        type: PropTypes.string,
        id: PropTypes.string,
      }),
      PropTypes.null,
    ]),
    name: PropTypes.string,
    metadata: PropTypes.shape({
      course: PropTypes.number,
    }),
    children: PropTypes.arrayOf(PropTypes.object),
  }),
  scrollRef: PropTypes.any, // The footer will need it
  openEnrollmentDrawer: PropTypes.bool, // Opens the enrollment drawer
};

export { CourseView };
