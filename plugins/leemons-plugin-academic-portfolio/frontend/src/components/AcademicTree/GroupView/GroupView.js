import React from 'react';
import PropTypes from 'prop-types';
import { Box, Title, Stack, Text, Select, TotalLayoutStepContainer } from '@bubbles-ui/components';
import { Controller, useForm } from 'react-hook-form';
import { GroupViewStyles } from './GroupView.styles';

const GroupView = ({ program, groupNode, scrollRef, openEnrollmentDrawer }) => {
  const { classes } = GroupViewStyles();
  const { control } = useForm();
  return (
    <TotalLayoutStepContainer
      stepName={groupNode?.name ? `${program?.name} - ${groupNode?.name}` : program?.name ?? ''}
      clean
      fullWidth
    >
      <Stack direction="column" spacing={3} className={classes.content}>
        <Title order={2}>{'TODO: Datos básicos'}</Title>
        <Stack spacing={5} className={classes.courseData}>
          <Box>
            <Text strong>{'TODO: Nº del curso:'} </Text>
            <Text>{'course.name'} </Text>
          </Box>
          <Box>
            <Text strong>{'TODO: Alías del curso:'} </Text>
            <Text>{'course.alias'} </Text>
          </Box>
          <Box>
            <Text strong>{'TODO: Créditos mínimos:'} </Text>
            <Text>{'course.credits'} </Text>
          </Box>
        </Stack>
        <Box className={classes.responsable}>
          <Controller
            name="responsable"
            control={control}
            defaultValue="responsable"
            render={({ field }) => <Select label="TODO: Responsable" {...field} />}
          />
        </Box>
        <Box>
          <Text>{'TODO: Para mayor configuración es necesario visitar:'} </Text>
          <Text de>{'Programas educativos'} </Text>
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
