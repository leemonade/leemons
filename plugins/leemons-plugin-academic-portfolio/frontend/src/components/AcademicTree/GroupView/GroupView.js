import React from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Title,
  Stack,
  Text,
  Select,
  TotalLayoutStepContainer,
  Alert,
  Button,
} from '@bubbles-ui/components';
import { Controller, useForm } from 'react-hook-form';
import { GroupViewStyles } from './GroupView.styles';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import prefixPN from '@academic-portfolio/helpers/prefixPN';
import { AddCircleIcon } from '@bubbles-ui/icons/outline';
import { useProgramDetail } from '@academic-portfolio/hooks';

const GroupView = ({ program, groupNode, scrollRef, openEnrollmentDrawer }) => {
  const [t] = useTranslateLoader(prefixPN('tree_page'));
  const { classes } = GroupViewStyles();
  const { control } = useForm();
  const { data: programDetail } = useProgramDetail(
    program.id,
    { enabled: !!program.id },
    true,
    false,
    false
  );
  console.log('programDetail', programDetail);
  console.log('program', program);
  console.log('groupNode', groupNode);
  return (
    <TotalLayoutStepContainer
      stepName={groupNode?.text ? `${program?.name} - ${groupNode?.text}` : program?.name ?? ''}
      clean
      fullWidth
      scrollRef={scrollRef}
    >
      <Stack direction="column" spacing={3} className={classes.content}>
        <Title order={2}>{t('basicDataTitle')}</Title>
        <Stack spacing={5} className={classes.courseData}>
          <Box>
            <Text strong>{t('courseNumber')} </Text>
            <Text>{'course.name'} </Text>
          </Box>
          <Box>
            <Text strong>{t('courseAlias')} </Text>
            <Text>{'course.alias'} </Text>
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
            defaultValue="responsable"
            render={({ field }) => <Select label={t('responsableLabel')} {...field} />}
          />
        </Box>
        <Box className={classes.responsableContainer}>
          <Text>{t('responsableMoreConfig')} </Text>
          <Text>{t('responsablePrograms')} </Text>
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
            <Button variant="link" leftIcon={<AddCircleIcon />}>
              {t('enrollButton')}
            </Button>
          </Box>
        </Box>
      </Stack>
    </TotalLayoutStepContainer>
  );
};

GroupView.propTypes = {
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

export { GroupView };
