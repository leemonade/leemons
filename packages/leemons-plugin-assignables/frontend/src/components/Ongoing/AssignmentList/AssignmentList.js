import React, { useState, useMemo } from 'react';
import { Box } from '@bubbles-ui/components';
import Filters from './components/Filters';
import { useAssignmentListStyle } from './AssignmentList.style';
import ActivitiesList from './components/ActivitiesList';

export default function AssignmentList({ closed }) {
  const labels = {
    title: 'Actividades',
    filters: {
      ongoing: 'En curso {{count}}',
      evaluated: 'Evaluadas {{count}}',
      history: 'Histórico {{count}}',
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
  const [filters, setFilters] = useState(null);

  const tabs = useMemo(() => {
    if (!closed) {
      return [
        {
          label: labels?.filters?.ongoing?.replace?.('{{count}}', ''), // `(${ongoingCount})`),
          value: 'ongoing',
        },
        {
          label: labels?.filters?.evaluated?.replace?.('{{count}}', ''), // `(${evaluatedCount})`),
          value: 'evaluated',
        },
      ];
    }

    return [
      {
        label: labels?.filters?.history?.replace?.('{{count}}', ''), // `(${evaluatedCount})`),
        value: 'history',
      },
      {
        label: labels?.filters?.evaluated?.replace?.('{{count}}', ''), // `(${evaluatedCount})`),
        value: 'evaluated',
      },
    ];
  }, [labels, closed]);

  const { classes } = useAssignmentListStyle();
  return (
    <Box className={classes?.root}>
      <Filters labels={labels.filters} tabs={tabs} value={filters} onChange={setFilters} />
      <ActivitiesList filters={filters} />
    </Box>
  );
}
