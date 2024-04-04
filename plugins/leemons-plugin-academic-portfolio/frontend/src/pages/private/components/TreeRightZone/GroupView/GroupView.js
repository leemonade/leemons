import React from 'react';
import { Box, Title, Stack, Text, Select } from '@bubbles-ui/components';
import { Controller, useForm } from 'react-hook-form';
import { GroupViewStyles } from './GroupView.styles';

const GroupView = () => {
  const { classes } = GroupViewStyles();
  const { control } = useForm();
  return (
    <Stack direction="column" spacing={3}>
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
  );
};

export { GroupView };
