import React from 'react';

import { TLayout } from '@bubbles-ui/components';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { prefixPN } from '@scores/helpers';
import { EvaluatedIcon } from '@learning-paths/components/ModuleDashboard/components/DashboardCard/components/EvaluationStateDisplay/icons/EvaluatedIcon';
import Filters from '@scores/components/__DEPRECATED__/ReviewerPage/Filters';
import Notebook from '@scores/components/__DEPRECATED__/FinalNotebook/Notebook';

export default function ReviewerPage() {
  const [t] = useTranslateLoader(prefixPN('reviewPage.header.admin'));

  const [filters, setFilters] = React.useState({});

  return (
    <TLayout>
      <TLayout.Header
        title={t('title')}
        icon={<EvaluatedIcon width={24} height={24} color="#000" />}
        cancelable={false}
      >
        <Filters onChange={setFilters} />
      </TLayout.Header>

      <TLayout.Content>
        <Notebook filters={filters} />
      </TLayout.Content>
    </TLayout>
  );
}
