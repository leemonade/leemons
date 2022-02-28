import React, { useMemo } from 'react';
import { AdminPageHeader } from '@bubbles-ui/leemons';
import {
  PageContainer,
  ContextContainer,
  Box,
  Select,
  TextInput,
  Table,
} from '@bubbles-ui/components';

export default function DetailsPage() {
  const columns = useMemo(() => [
    {
      Header: 'STUDENT',
      accessor: 'student',
    },
    {
      Header: 'STATUS',
      accessor: 'status',
    },
    {
      Header: 'COMPLETED',
      accessor: 'completed',
    },
    {
      Header: 'AV. TIME (MIN)',
      accessor: 'avgTime',
    },
    {
      Header: 'SCORE',
      accessor: 'score',
    },
    {
      Header: 'ACTIONS',
      accessor: 'actions',
    },
  ]);
  return (
    <ContextContainer>
      <AdminPageHeader values={{ title: 'NOMBRE DE LA TAREA', description: 'GRUPO Y FECHA' }} />
      <PageContainer>
        <ContextContainer>
          <ContextContainer direction="row">
            <ContextContainer title="STATUS">-</ContextContainer>

            <ContextContainer title="TIMELINE">-</ContextContainer>
          </ContextContainer>

          <ContextContainer title="x STUDENTS">
            <ContextContainer direction="row">
              <Box>
                <Select
                  label="BULK ACTION (0 Selected)"
                  orientation="horizontal"
                  placeholder="SELECT ACTION..."
                  data={[{ value: 'Hola', label: 'Holaasa' }]}
                />
              </Box>
              <TextInput placeholder="SEARCH STUDENTS" />
            </ContextContainer>

            <Table columns={columns} data={[]} />
          </ContextContainer>
        </ContextContainer>
      </PageContainer>
    </ContextContainer>
  );
}
