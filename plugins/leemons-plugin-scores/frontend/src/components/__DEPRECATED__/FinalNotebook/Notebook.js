import React from 'react';
import { ContextContainer } from '@bubbles-ui/components';
import { useProgramDetail } from '@academic-portfolio/hooks';
import { compact } from 'lodash';
import getCourseName from '@academic-portfolio/helpers/getCourseName';
import EmptyState from '../Notebook/EmptyState';
import { Filters } from './Filters';
import { FinalScores } from './FinalScores';

function useTitle(filters) {
  const { data: programData } = useProgramDetail(filters.program, { enabled: !!filters.program });

  const course = programData?.courses?.find((course) => course.id === filters.course);
  const group = programData?.groups?.find((group) => group.id === filters.group);

  return compact([programData?.name, course && getCourseName(course), group?.name]).join(' - ');
}

export default function Notebook({ filters }) {
  const [localFilters, setLocalFilters] = React.useState({});
  const title = useTitle(filters);

  if (!filters?.program || !filters?.course) {
    return <EmptyState />;
  }

  return (
    <ContextContainer title={title}>
      <Filters onChange={setLocalFilters} />
      <FinalScores filters={filters} localFilters={localFilters} />
    </ContextContainer>
  );
}
