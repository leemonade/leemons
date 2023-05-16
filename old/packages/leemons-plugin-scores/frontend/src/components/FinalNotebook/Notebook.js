import React from 'react';
import { Box } from '@bubbles-ui/components';
import { Header } from '../Notebook/components/Header';
import EmptyState from '../Notebook/EmptyState';
import { Filters } from './Filters';
import { FinalScores } from './FinalScores';

export default function Notebook({ filters }) {
  const [localFilters, setLocalFilters] = React.useState({});

  if (!filters?.program || !filters?.course) {
    return <EmptyState />;
  }

  return (
    <Box style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <Header filters={filters} variant="finalNotebook" allowDownload />
      <Filters onChange={setLocalFilters} />
      <FinalScores filters={filters} localFilters={localFilters} />
    </Box>
  );
}
