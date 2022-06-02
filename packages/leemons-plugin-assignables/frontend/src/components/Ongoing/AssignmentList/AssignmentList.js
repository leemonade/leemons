import React from 'react';
import { Box, SearchInput, SegmentedControl, Select } from '@bubbles-ui/components';
import Filters from './components/Filters';
import { useAssignmentListStyle } from './AssignmentList.style';
import ActivitiesList from './components/ActivitiesList';

export default function AssignmentList() {
  const labels = {
    title: 'Actividades',
    filters: {
      ongoing: 'En curso {{count}}',
      evaluated: 'Evaluadas {{count}}',
      search: 'Buscar actividades en curso',
      subject: 'Asignatura/grupo',
      status: 'Estado',
      type: 'Tipo',
      seeAll: 'Ver todas',
    },
    columns: {
      name: 'Nombre',
      subject: 'Asignatura/grupo',
      start: 'Inicio',
      deadline: 'Fecha límite',
      status: 'Estado',
      submission: 'Entrega',
      students: 'Estudiantes',
      opened: 'Abierta',
      started: 'Comenzada',
      completed: 'Completada',
    },
  };
  const ongoingCount = 5;
  const evaluatedCount = 7;

  const { classes } = useAssignmentListStyle();
  return (
    <Box className={classes?.root}>
      <Filters
        labels={labels.filters}
        tabs={[
          {
            label: labels?.filters?.ongoing?.replace?.('{{count}}', `(${ongoingCount})`),
            value: 'ongoing',
          },
          {
            label: labels?.filters?.evaluated?.replace?.('{{count}}', `(${evaluatedCount})`),
            value: 'evaluated',
          },
        ]}
      />
      <ActivitiesList />
    </Box>
  );
}
