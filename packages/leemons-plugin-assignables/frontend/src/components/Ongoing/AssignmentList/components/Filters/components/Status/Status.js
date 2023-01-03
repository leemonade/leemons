import React from 'react';
import { Select } from '@bubbles-ui/components';
import { useIsTeacher, useIsStudent } from '@academic-portfolio/hooks';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import prefixPN from '@assignables/helpers/prefixPN';
import unflatten from '@academic-portfolio/helpers/unflatten';
import { get } from 'lodash';

function useStatus(labels) {
  const [, translations] = useTranslateLoader(prefixPN('activity_status'));

  const localizations = React.useMemo(() => {
    if (translations && translations.items) {
      const res = unflatten(translations.items);
      const data = get(res, prefixPN('activity_status'));

      // EN: Modify the data object here
      // ES: Modifica el objeto data aquí
      return data;
    }

    return {};
  }, [translations]);

  return React.useMemo(
    () => [
      {
        value: 'all',
        label: labels?.seeAll,
      },
      {
        value: 'opened',
        label: localizations?.opened,
      },
      {
        value: 'closed',
        label: localizations?.closed,
      },
    ],
    [localizations, labels?.seeAll]
  );
}

export default function Status({ labels, value, onChange }) {
  const status = useStatus(labels);
  return <Select label={labels?.status} data={status} value={value} onChange={onChange} />;
}
