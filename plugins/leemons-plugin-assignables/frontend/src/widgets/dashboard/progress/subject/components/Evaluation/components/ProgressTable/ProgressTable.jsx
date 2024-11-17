import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { Box, PaginatedList, Text } from '@bubbles-ui/components';

import useTranslateLoader from '@multilanguage/useTranslateLoader';
import prefixPN from '@assignables/helpers/prefixPN';
import useActivitiesWithOpenedModulesChildren from './hooks/useActivitiesWithOpenedModulesChildren';
import useColumns from './hooks/useColumns';

export default function ProgressTable({ class: classroom, weights, filters }) {
  const [t] = useTranslateLoader(prefixPN('activities_list'));

  const [modulesOpened, setModulesOpened] = useState([]);
  const [page, setPage] = useState(1);
  const size = 10;

  const columns = useColumns({ weights, setModulesOpened, modulesOpened });
  const { activities, totalCount, isLoading } = useActivitiesWithOpenedModulesChildren({
    class: classroom,
    weights,
    filters,
    modulesOpened,
    page,
    size,
  });

  if (!activities?.length) {
    return (
      <Box
        sx={(theme) => ({
          width: '100%',
          height: 200, // 328,
          borderRadius: theme.spacing[1],
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          gap: theme.spacing[1],
        })}
      >
        <Text color="primary">{t('emptyState')}</Text>
      </Box>
    );
  }

  return (
    <PaginatedList
      columns={columns}
      items={activities}
      page={page}
      size={size}
      loading={isLoading}
      totalCount={totalCount}
      totalPages={Math.ceil(totalCount / size)}
      onPageChange={setPage}
      selectable
      hdePaper
      onStyleRow={({ row }) =>
        weights?.type === 'modules' && row.original.instance.metadata?.module?.id
          ? { backgroundColor: '#F8F9FB' }
          : null
      }
    />
  );
}

ProgressTable.propTypes = {
  class: PropTypes.string.isRequired,
  weights: PropTypes.shape({
    type: PropTypes.string.isRequired,
    weights: PropTypes.object.isRequired,
  }).isRequired,
  filters: PropTypes.object.isRequired,
};
